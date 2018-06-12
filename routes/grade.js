var router = require("express").Router();

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("grade/index", {
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
