const bcrypt = require('bcrypt');

const password = 'admin123'; // your admin password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log(hash);
});
