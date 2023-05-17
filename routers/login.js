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
    req.session.isAdmin = true; 
    res.redirect('..');
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;