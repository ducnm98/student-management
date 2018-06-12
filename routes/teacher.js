var router = require("express").Router();

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("teacher/index",{
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
