var router = require('express').Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    //console.log("Logged in");
    res.render('index', { title: req.user.email });
  }
  else res.render('login');
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: false,
}));

module.exports = router;
