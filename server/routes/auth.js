const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'yoursecret';

module.exports = (db) => {
  const router = express.Router();

  router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    try {
      const [userExists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if (userExists.length > 0) return res.status(400).json({ message: 'Email already registered' });

      const hash = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);

      res.json({ message: 'Signup successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    try {
      const [rows] = await db.query('SELECT id, password FROM users WHERE email = ?', [email]);
      if (rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
