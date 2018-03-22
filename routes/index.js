var express = require('express');
var router = express.Router();
const Student = require('../config/models/index').Student;

/* GET home page. */
router.get('/', function(req, res, next) {
  Student
  .findOne({ where: { id: 5, } })
  .then(function(result) {
    //res.json(result);
    result.sayStuff();
  })
  .catch(error => next(error))
});

module.exports = router;
