var router = require("express").Router();
const passport = require("passport");
var sequelize = require("../config/db/sequelize");

router.get("/", function(req, res, next) {
  if (!req.isAuthenticated()) {
    console.log(req.user);
    res.render("report/index");
  } else {
    res.redirect("/login");
  }
});



module.exports = router;
