const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,       // Render DB host
  user: process.env.DB_USER,       // Render DB username
  password: process.env.DB_PASSWORD, // Render DB password
  database: process.env.DB_NAME,   // Render DB name
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // required on Render
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch(err => console.error('PostgreSQL connection failed:', err));

module.exports = pool;
