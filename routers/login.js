var express = require('express');
const router = express.Router();


const adminUsername = "admin";
const adminPassword = "admin132";

router.get('/', (req, res) => {
    res.render('login');
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && password === adminPassword) {
    res.cookie('isAdmin', true);
    res.redirect('..');
  } else {
    res.cookie('isAdmin', false);
    alert('Incorrect password or admin name');
    res.redirect('/');
  }
});

module.exports = router;