var express = require('express');
const router = express.Router();


const adminUsername = "admin";
const adminPassword = "admin132";

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username === adminUsername && password === adminPassword) {
    req.session.isAdmin = true; 
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;