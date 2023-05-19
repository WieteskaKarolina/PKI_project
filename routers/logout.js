const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.isAdmin = false;
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
