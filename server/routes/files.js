const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'yoursecret';

const uploadDir = '/home/ec2-user/files';

// Ensure upload dir exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${req.userId}-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = (db) => {
  const router = express.Router();

  // Upload and share file
  router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    const { recipients, expiry } = req.body;
    if (!recipients) return res.status(400).json({ message: 'Recipients required' });

    let recipientsArray;
    try {
      recipientsArray = JSON.parse(recipients);
    } catch {
      return res.status(400).json({ message: 'Invalid recipients format' });
    }

    if (!req.file) return res.status(400).json({ message: 'File not uploaded' });

    try {
      // Save file metadata
      const expiryTime = new Date(Date.now() + Number(expiry) * 1000); // expiry in seconds from now
      const [result] = await db.query(
        'INSERT INTO files (owner_id, filename, filepath, size, upload_time, expiry_time, status) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
        [req.userId, req.file.originalname, req.file.path, req.file.size, expiryTime, 'active']
      );
      const fileId = result.insertId;

      // Share file to each recipient
      for (const rId of recipientsArray) {
        await db.query(
          'INSERT INTO file_shares (file_id, sender_id, recipient_id, share_time, expiry_time, status) VALUES (?, ?, ?, NOW(), ?, ?)',
          [fileId, req.userId, rId, expiryTime, 'active']
        );
      }

      res.json({ message: 'File uploaded and shared successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get files sent by user
  router.get('/sent', authMiddleware, async (req, res) => {
    try {
      const [files] = await db.query(`
        SELECT f.id, f.filename, f.expiry_time, f.status,
          JSON_ARRAYAGG(JSON_OBJECT('id', u.id, 'username', u.username)) AS recipients
        FROM files f
        JOIN file_shares fs ON fs.file_id = f.id
        JOIN users u ON u.id = fs.recipient_id
        WHERE f.owner_id = ?
        GROUP BY f.id
        ORDER BY f.upload_time DESC
      `, [req.userId]);

      // Parse recipients JSON string to array
      const formattedFiles = files.map(f => ({
        ...f,
        recipients: JSON.parse(f.recipients),
      }));

      res.json({ files: formattedFiles });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get files received by user
  router.get('/received', authMiddleware, async (req, res) => {
    try {
      const [files] = await db.query(`
        SELECT f.id, f.filename, f.expiry_time, f.status,
          JSON_OBJECT('id', u.id, 'username', u.username) AS sender,
          f.filepath
        FROM file_shares fs
        JOIN files f ON f.id = fs.file_id
        JOIN users u ON u.id = fs.sender_id
        WHERE fs.recipient_id = ? AND fs.status = 'active' AND f.status = 'active' AND f.expiry_time > NOW()
        ORDER BY fs.share_time DESC
      `, [req.userId]);

      // Add download url per file
      const downloadBase = process.env.DOWNLOAD_BASE_URL || 'http://localhost:3000/api/files/download';
      const formattedFiles = files.map(f => ({
        ...f,
        sender: JSON.parse(f.sender),
        download_url: `${downloadBase}/${f.id}`,
      }));

      res.json({ files: formattedFiles });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Secure file download route
  router.get('/download/:fileId', authMiddleware, async (req, res) => {
    const fileId = req.params.fileId;
    const userId = req.userId;

    try {
      // Check if user owns or is recipient of the file and file is active
      const [rows] = await db.query(`
        SELECT f.filepath FROM files f
        JOIN file_shares fs ON fs.file_id = f.id
        WHERE f.id = ? AND fs.status = 'active' AND f.status = 'active' AND f.expiry_time > NOW()
          AND (f.owner_id = ? OR fs.recipient_id = ?)
        LIMIT 1
      `, [fileId, userId, userId]);

      if (rows.length === 0) return res.status(403).send('Access denied or file expired');

      const filepath = rows[0].filepath;
      res.sendFile(filepath, err => {
        if (err) res.status(500).send('File not found or error in download');
      });

    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  return router;
};
