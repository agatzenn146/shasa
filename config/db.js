// config/db.js
const { Pool } = require('pg');
require('dotenv').config(); // load .env variables

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,         // PostgreSQL default port
  ssl: { rejectUnauthorized: false } // required for Render
});

// Test connection
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL successfully!');
    client.release();
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err.stack);
  });

module.exports = pool;
