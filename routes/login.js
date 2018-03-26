var router = require('express').Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) res.render('index', { title: req.user.email });
  else res.render('login');
  next();
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false,
}));

module.exports = router;
