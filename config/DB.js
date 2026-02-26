const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL successfully!");
    client.release();
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

module.exports = pool;
