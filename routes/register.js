var router = require('express').Router();
const passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', passport.authenticate('local-register', {
  successRedirect: '/index',
  failureRedirect: '/register',
  failureFlash: false,
}));

module.exports = router;