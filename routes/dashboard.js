var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('dashboard');
  } else {
    res.redirect('/login');
  }
  
});

module.exports = router;
