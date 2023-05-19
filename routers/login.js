const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const adminUsername = "admin";
const adminPasswordHash = "$2b$10$1/NLwFav/Nij/6kVB9dJneQug9V6Fm6ol4.Ss0pB8QySawFJm8F1y";

router.get('/', (req, res) => {
  res.render('login');
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
    req.session.isAdmin = true;
    res.redirect('/');
  } else {
    res.redirect('/login?invalid=true');
  }
});

module.exports = router;
