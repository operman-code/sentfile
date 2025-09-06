require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

const PORT = process.env.PORT || 3000;
let db;

async function initDB() {
  db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Import routes AFTER db is initialized
  const authRoutes = require('./routes/auth')(db);
  const userRoutes = require('./routes/users')(db);

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  // API root route can be here or removed if you prefer React frontend handling '/'
  app.get('/', (req, res) => {
    res.json({ message: 'Sentfile backend is running' });
  });

  // Serve React app for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

initDB().catch(err => {
  console.error('DB Initialization failed:', err);
  process.exit(1);
});
