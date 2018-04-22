var router = require("express").Router();

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("activity/index");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
