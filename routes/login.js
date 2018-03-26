var router = require('express').Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  if (req.isAuthenticated()) 
    res.redirect('/')
  else res.render('login');
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false,
}));

module.exports = router;
