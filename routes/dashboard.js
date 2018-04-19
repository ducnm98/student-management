var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render("dashboard/dashboard", { 
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});


module.exports = router;
