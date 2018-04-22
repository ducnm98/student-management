var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render("dashboard/index", { 
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});


module.exports = router;
