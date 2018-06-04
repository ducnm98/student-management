var router = require("express").Router();
var sequelize = require("../config/db/sequelize");
var moment = require("moment");

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize.query("CALL `findPersonDetail`(:personID)", {
      replacements: {
        personID: req.user.personID,
      }
    }).then(profile => {
      profile = JSON.parse(JSON.stringify(profile[0]));
      profile.dateOfBirth = moment(profile.dateOfBirth).format("MM/DD/YYYY");
      profile.contractStartDate = moment(profile.contractStartDate).format("MM/DD/YYYY");
      if (profile.personsType == 'employee') {
        res.render("profile/index", {
          isEmployee: true,
          profile: profile,
        });
      } else {
        res.render("profile/index", {
          isEmployee: false,
          profile: profile,
          role: req.user.role,
        });
      }
    })
    
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
