var router = require("express").Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("subject/index");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
