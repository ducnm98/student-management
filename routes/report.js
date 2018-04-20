var router = require("express").Router();
const passport = require("passport");
var sequelize = require("../config/db/sequelize");

/* GET home page. */
router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render("report/index");
  } else {
    res.redirect("/login");
  }
});



module.exports = router;
