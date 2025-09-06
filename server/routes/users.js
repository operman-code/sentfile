const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = express.Router();

  // JWT authentication middleware
  function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  // Search users route
  router.get('/search', authMiddleware, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.json({ users: [] });

      const searchTerm = `%${q}%`;
      const [users] = await db.query(
        'SELECT id, username, email FROM user WHERE username LIKE ? OR email LIKE ? LIMIT 20',
        [searchTerm, searchTerm]
      );
      res.json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};
