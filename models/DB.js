const mysql = require('mysql2');
require('dotenv').config(); // make sure this is at the top

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',  // XAMPP default
  database: process.env.DB_NAME || 'shasa_db'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('MySQL connected');
  }
});

module.exports = db;
