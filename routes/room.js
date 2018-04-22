var router = require("express").Router();

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("room/index");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
