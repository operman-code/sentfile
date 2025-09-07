const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'yoursecret';

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

  router.get('/search', authMiddleware, async (req, res) => {
    const q = req.query.q || '';
    try {
      const [users] = await db.query(
        "SELECT id, username, email FROM users WHERE username LIKE ? OR email LIKE ? LIMIT 20",
        [`%${q}%`, `%${q}%`]
      );
      res.json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
