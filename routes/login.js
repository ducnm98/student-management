var router = require("express").Router();
const passport = require("passport");
var sequelize = require("../config/db/sequelize");
/* GET home page. */
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.redirect("/");
    
  }
  else res.render("login");
});

router.post("/", 
  passport.authenticate("local-login", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true
  })
);

module.exports = router;
