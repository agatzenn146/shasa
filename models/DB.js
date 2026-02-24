const { Pool } = require('pg');

// Use DATABASE_URL from Render environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // DATABASE_URL set in Render
  ssl: {
    rejectUnauthorized: false // required for Render PostgreSQL
  }
});

pool.connect()
  .then(() => console.log('PostgreSQL connected!'))
  .catch(err => console.error('PostgreSQL connection failed:', err));

module.exports = pool;
