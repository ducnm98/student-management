var router = require("express").Router();

/* GET logout page. */
router.get("/", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;