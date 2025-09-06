const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = express.Router();

  // Signup route
  router.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const [existing] = await db.query('SELECT id FROM user WHERE username = ? OR email = ?', [username, email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hashedPassword]);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Login route
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
      if (rows.length === 0) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '12h' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};
