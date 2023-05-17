var express = require('express');
const router = express.Router();
const notifier = require('node-notifier');

const adminUsername = "admin";
const adminPassword = "admin132";

router.get('/', (req, res) => {
    res.render('login');
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && password === adminPassword) {
    const isAdmin = true;
    res.cookie('isAdmin', isAdmin);
    res.redirect('/');
  } else {
    notifier.notify('Incorrect password or admin name');
    const isAdmin = false;
    res.cookie('isAdmin', isAdmin);
    res.redirect('/login');
  }
});

module.exports = router;