const express = require('express');
const router = express.Router();
const db = require('../config/db'); // MySQL connection

/* =====================
   HOME PAGE
===================== */
router.get('/', (req, res) => {
  db.query('SELECT * FROM events ORDER BY evdate DESC LIMIT 5', (err, results) => {
    if (err) {
      console.error(err);
      return res.render('index', { churchActivities: { latest: [] } });
    }
    res.render('index', { churchActivities: { latest: results } });
  });
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

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    req.flash('error_msg', 'Please fill in all fields');
    return res.redirect('/contact');
  }

  // Save contact message in database
  db.query(
    'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to send message');
        return res.redirect('/contact');
      }
      req.flash('success_msg', 'Your message has been sent. Thank you!');
      res.redirect('/contact');
    }
  );
});

/* =====================
   MESSAGES PAGE (USER)
===================== */
router.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.render('messages', { messages: [] });
    }
    res.render('messages', { messages: results });
  });
});

/* =====================
   EVENTS PAGE (USER)
===================== */
router.get('/events', (req, res) => {
  db.query('SELECT * FROM events ORDER BY evdate ASC', (err, results) => {
    if (err) {
      console.error(err);
      return res.render('events', { myEvents: [] });
    }
    res.render('events', { myEvents: results });
  });
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
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    req.flash('error_msg', 'Please fill in all fields');
    return res.redirect('/register');
  }

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Error registering user');
        return res.redirect('/register');
      }
      req.flash('success_msg', 'Registration successful! You can now login.');
      res.redirect('/login');
    }
  );
});

// Login POST
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error_msg', 'Please enter email and password');
    return res.redirect('/login');
  }

  db.query(
    'SELECT * FROM users WHERE email=? AND password=?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Login error');
        return res.redirect('/login');
      }

      if (results.length === 0) {
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/login');
      }

      req.session.user = results[0]; // store user in session
      req.flash('success_msg', 'Login successful!');
      res.redirect('/');
    }
  );
});

module.exports = router;
