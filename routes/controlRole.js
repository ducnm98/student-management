var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("role/index", {showRole: false});
  } else {
    res.redirect("/login");
  }
});

router.get("/:personID", (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role.isAdmin) {
      sequelize.query("CALL `findPersonInfo`(:personID)", {
        replacements: {
          personID: req.params.personID,
        }
      }).then(personInfo => {
        personInfo = JSON.parse(JSON.stringify(personInfo[0]));
        sequelize.query("CALL `findRole`(:personID)", {
          replacements: {
            personID: req.params.personID,
          }
        }).then(roleInfo => {
          let col = [];
          for (let i = 0; i < roleInfo.length; i++) {
              for (let key in roleInfo[i]) {
                  if (col.indexOf(key) === -1) {
                      col.push(key);
                  }
              }
          }
          console.log(col)
          roleInfo = JSON.parse(JSON.stringify(roleInfo[0]));
          res.render("role/index", {
            person: personInfo,
            roleInfo: roleInfo,
            col: col,
            showRole: true
          })
        })
      })
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role.isAdmin) {
      res.redirect(`/role/${req.body.personID}`);
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/");
  }
});
module.exports = router;
