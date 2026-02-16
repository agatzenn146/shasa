const db = require('../config/db');

const Event = {
  getAll: callback => {
    db.query('SELECT * FROM events ORDER BY id DESC', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM events WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO events SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE events SET ? WHERE id = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM events WHERE id = ?', [id], callback);
  }
};

module.exports = Event;
