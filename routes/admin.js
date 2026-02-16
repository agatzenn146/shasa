const express = require('express');
const router = express.Router();
const db = require('../config/db'); // MySQL connection pool
const path = require('path');
const fileUpload = require('express-fileupload');

// ==========================
// Middleware to check admin
// ==========================
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  req.flash('error_msg', 'Please login first');
  return res.redirect('/admin/login'); // redirect to login page
}

// ==========================
// Default admin route
// ==========================
router.get('/', (req, res) => {
  if (req.session && req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin/login');
});

// ==========================
// Admin Login Page
// ==========================
router.get('/login', (req, res) => {
  res.render('admin/login', { error_msg: req.flash('error_msg') });
});

// ==========================
// Admin Login POST
// ==========================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Hard-coded admin
  if (email === 'admin@shasa.com' && password === 'admin123') {
    req.session.admin = { email, role: 'admin' };
    return res.redirect('/admin/dashboard'); // ✅ redirect after login
  }

  req.flash('error_msg', 'Invalid email or password');
  res.redirect('/admin/login'); // redirect back to login page
});

// ==========================
// Admin Logout
// ==========================
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login'); // redirect to login after logout
  });
});

// ==========================
// Admin Dashboard
// ==========================
router.get('/dashboard', isAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS totalEvents FROM events', (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to load dashboard');
      return res.render('admin/dashboard', { totalEvents: 0, admin: req.session.admin });
    }
    res.render('admin/dashboard', { totalEvents: results[0].totalEvents, admin: req.session.admin });
  });
});

// ==========================
// Show all events
// ==========================
router.get('/all-events', isAdmin, (req, res) => {
  db.query('SELECT * FROM events ORDER BY evdate DESC', (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to load events');
      return res.render('admin/all-events', { events: [], admin: req.session.admin });
    }
    res.render('admin/all-events', { events: results, admin: req.session.admin });
  });
});

// ==========================
// New Event Form
// ==========================
router.get('/new-events', isAdmin, (req, res) => {
  res.render('admin/new-events', { admin: req.session.admin, error_msg: null });
});

// ==========================
// Add New Event
// ==========================
router.post('/new-events', isAdmin, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.render('admin/new-events', { admin: req.session.admin, error_msg: 'Please upload an image' });
    }

    const { name, description, evdate, time } = req.body;
    const imageFile = req.files.image;
    const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);

    await imageFile.mv(uploadPath);

    db.query(
      "INSERT INTO events (name, description, evdate, time, image) VALUES (?, ?, ?, ?, ?)",
      [name, description, evdate, time, imageFile.name],
      (err) => {
        if (err) {
          console.error(err);
          return res.render('admin/new-events', { admin: req.session.admin, error_msg: 'Failed to add event' });
        }

        req.flash('success_msg', "Event added successfully!");
        res.redirect('/admin/all-events'); // redirect to show all events
      }
    );
  } catch (err) {
    console.error(err);
    res.render('admin/new-events', { admin: req.session.admin, error_msg: 'Something went wrong' });
  }
});

// ==========================
// Edit Event Form
// ==========================
router.get('/edit-event/:id', isAdmin, (req, res) => {
  db.query('SELECT * FROM events WHERE id=?', [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      req.flash('error_msg', 'Event not found');
      return res.redirect('/admin/all-events');
    }
    res.render('admin/edit-event', { event: results[0], admin: req.session.admin, error_msg: null });
  });
});

// ==========================
// Update Event
// ==========================
router.post('/edit-event/:id', isAdmin, async (req, res) => {
  try {
    const { name, description, evdate, time, currentImage } = req.body;
    let image = currentImage;

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);
      await imageFile.mv(uploadPath);
      image = imageFile.name;
    }

    db.query(
      'UPDATE events SET name=?, description=?, evdate=?, time=?, image=? WHERE id=?',
      [name, description, evdate, time, image, req.params.id],
      (err) => {
        if (err) {
          console.error(err);
          req.flash('error_msg', 'Failed to update event');
          return res.redirect('/admin/all-events');
        }
        req.flash('success_msg', 'Event updated successfully');
        res.redirect('/admin/all-events');
      }
    );
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/admin/all-events');
  }
});

// ==========================
// Delete Event
// ==========================
router.post('/delete-event/:id', isAdmin, (req, res) => {
  db.query('DELETE FROM events WHERE id=?', [req.params.id], (err) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to delete event');
      return res.redirect('/admin/all-events');
    }
    req.flash('success_msg', 'Event deleted successfully');
    res.redirect('/admin/all-events');
  });
});



// Show all messages
router.get('/all-messages', isAdmin, (req, res) => {
    db.query('SELECT * FROM messages ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error(err);
            req.flash('error_msg', 'Failed to load messages');
            return res.render('admin/all-messages', { messages: [] });
        }
        res.render('admin/all-messages', { messages: results });
    });
});

// ==========================
// New Message Form
// ==========================
router.get('/new-messages', isAdmin, (req, res) => {
  res.render('admin/new-messages', { admin: req.session.admin, error_msg: null });
});



// ==========================
// Add New Message
// ==========================


router.post('/new-messages', isAdmin, async (req, res) => {
  try {
    const { title, designation, residence } = req.body;

    if (!req.files || !req.files.image) {
      req.flash('error_msg', 'Image is required');
      return res.redirect('/admin/new-messages');
    }

    const imageFile = req.files.image;
    const fileName = Date.now() + '_' + imageFile.name;
    const uploadPath = path.join(__dirname, '../public/uploads/', fileName);

    await imageFile.mv(uploadPath);

    const sql = `
      INSERT INTO messages (title, designation, residence, image)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [title, designation, residence, fileName], (err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to save message');
        return res.redirect('/admin/new-messages');
      }

      req.flash('success_msg', 'Message added successfully');
      res.redirect('/admin/all-messages');
    });

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/admin/new-messages');
  }
});

// Show all Executives


// ==========================
// Show all Executives
// ==========================
router.get('/all-executives', isAdmin, (req, res) => {
  db.query('SELECT * FROM executives ORDER BY executive_id DESC', (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to load executives');
      return res.render('admin/all-executives', {
        executives: [],
        admin: req.session.admin
      });
    }

    res.render('admin/all-executives', {
      executives: results,
      admin: req.session.admin
    });
  });
});

// ==========================
// New Executive Form
// ==========================
router.get('/new-executives', isAdmin, (req, res) => {
  res.render('admin/new-executives', { admin: req.session.admin, error_msg: null });
});

// ==========================
// Add New Executive
// ==========================
router.post('/new-executives', isAdmin, async (req, res) => {
  try {
    const { first_name, last_name, email, position } = req.body;

    if (!req.files || !req.files.image) {
      req.flash('error_msg', 'Image is required');
      return res.redirect('/admin/new-executives');
    }

    const imageFile = req.files.image;
    const fileName = Date.now() + '_' + imageFile.name;
    const uploadPath = path.join(__dirname, '../public/uploads/', fileName);

    await imageFile.mv(uploadPath);

    const sql = `
      INSERT INTO executives (first_name, last_name, email, position, photo)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [first_name, last_name, email, phone_number, position, photo], (err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to save executive');
        return res.redirect('/admin/new-executives');
      }

      req.flash('success_msg', 'Executive added successfully');
      res.redirect('/admin/all-executives');
    });

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/admin/new-executives');
  }
});

// ==========================
// Edit Executive Form
// ==========================
router.get('/edit-executive/:id', isAdmin, (req, res) => {
  db.query('SELECT * FROM executives WHERE id=?', [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      req.flash('error_msg', 'Executive not found');
      return res.redirect('/admin/all-executives');
    }
    res.render('admin/edit-executive', { executive: results[0], admin: req.session.admin });
  });
});

// ==========================
// Update Executive
// ==========================
router.post('/edit-executive/:id', isAdmin, async (req, res) => {
  try {
    const { first_name, last_name, email, position, currentImage } = req.body;
    let photo = currentImage;

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);
      await imageFile.mv(uploadPath);
      photo = imageFile.name;
    }

    const sql = `
      UPDATE executives
      SET first_name=?, last_name=?, email=?, position=?, photo=?
      WHERE id=?
    `;

    db.query(sql, [first_name, last_name, email, position, photo, req.params.id], (err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update executive');
        return res.redirect('/admin/all-executives');
      }

      req.flash('success_msg', 'Executive updated successfully');
      res.redirect('/admin/all-executives');
    });

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/admin/all-executives');
  }
});

// ==========================
// Delete Executive
// ==========================
router.post('/delete-executive/:id', isAdmin, (req, res) => {
  db.query('DELETE FROM executives WHERE id=?', [req.params.id], (err) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to delete executive');
      return res.redirect('/admin/all-executives');
    }

    req.flash('success_msg', 'Executive deleted successfully');
    res.redirect('/admin/all-executives');
  });
});


module.exports = router;
