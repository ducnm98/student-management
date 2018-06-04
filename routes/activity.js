var router = require("express").Router();

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("activity/index", {
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
