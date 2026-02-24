const express = require('express');
const router = express.Router();
const db = require('../config/db'); // PostgreSQL connection pool

/* =====================
   HOME PAGE
===================== */
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY evdate DESC LIMIT 5');
    res.render('index', { churchActivities: { latest: result.rows } });
  } catch (err) {
    console.error(err);
    res.render('index', { churchActivities: { latest: [] } });
  }
});

/* =====================
   ABOUT PAGE
===================== */
router.get('/about', (req, res) => {
  res.render('about');
});

/* =====================
   CONTACT PAGE
===================== */
router.get('/contact', (req, res) => {
  res.render('contact');
});

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    req.flash('error_msg', 'Please fill in all fields');
    return res.redirect('/contact');
  }

  try {
    await db.query(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    req.flash('success_msg', 'Your message has been sent. Thank you!');
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to send message');
    res.redirect('/contact');
  }
});

/* =====================
   MESSAGES PAGE (USER)
===================== */
router.get('/messages', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.render('messages', { messages: result.rows });
  } catch (err) {
    console.error(err);
    res.render('messages', { messages: [] });
  }
});

/* =====================
   EVENTS PAGE (USER)
===================== */
router.get('/events', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY evdate ASC');
    res.render('events', { myEvents: result.rows });
  } catch (err) {
    console.error(err);
    res.render('events', { myEvents: [] });
  }
});

/* =====================
   USER AUTH
===================== */
// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Register POST
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    req.flash('error_msg', 'Please fill in all fields');
    return res.redirect('/register');
  }

  try {
    await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, password]
    );
    req.flash('success_msg', 'Registration successful! You can now login.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error registering user');
    res.redirect('/register');
  }
});

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error_msg', 'Please enter email and password');
    return res.redirect('/login');
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email=$1 AND password=$2',
      [email, password]
    );

    if (result.rows.length === 0) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/login');
    }

    req.session.user = result.rows[0]; // store user in session
    req.flash('success_msg', 'Login successful!');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Login error');
    res.redirect('/login');
  }
});

module.exports = router;
