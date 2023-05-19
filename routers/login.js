const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const adminUsername = "admin";
const adminPasswordHash = "$2b$10$qfIovW8dyoZiYAB2aEd1P.6H6mflvcAlTMRiEdA2ITBamNNsStL6e";

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
