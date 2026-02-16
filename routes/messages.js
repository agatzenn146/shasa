const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your MySQL connection

// Middleware to check admin
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  req.flash('error_msg', 'Please login first');
  res.redirect('/admin/login');
}

// Show New Message Form
router.get('/new-messages', isAdmin, (req, res) => {
  res.render('admin/new-messages', { admin: req.session.admin });
});

// Handle form submission
router.post('/new-messages', isAdmin, (req, res) => {
  const { name, email, message } = req.body;

  db.query(
    'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err, result) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to save message');
        return res.redirect('/admin/new-messages');
      }
      req.flash('success_msg', 'Message saved successfully');
      res.redirect('/admin/new-messages');
    }
  );
});

// Export router
module.exports = router;
