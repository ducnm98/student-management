var router = require('express').Router();
//const Student = require('../config/models/index').Student;
//const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) res.render('index', { title: req.user.email });
  else res.redirect('/login');
});

//For testing purposes
/*router.post('/test', function(req, res, next) {
  Student
  .findOne({ where: { email: req.body.email } })
  .then(data => { data.compare(req.body.password, (result) => {
    res.json(result);
  }) })
  .catch(error => next(error))

});*/

module.exports = router;
