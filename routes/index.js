var router = require('express').Router();
//const Student = require('../config/models/index').Student;
//const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) res.render('index', { title: req.user.email });
  else res.redirect('/login');
});

module.exports = router;
