var router = require("express").Router();
const passport = require("passport");

/* GET home page. */
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard"); 
  }
  else res.render("login", { err: "",});
});

router.get("/:error", (req, res) => {
  res.render("login", { err: "You type wrong password",});
});

router.post("/", 
  passport.authenticate("local-login", {
    failureRedirect: "/login/wrongpass",
    successRedirect: "/",
    failureFlash: true
  })
);

module.exports = router;
