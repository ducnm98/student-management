var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("student/index");
  } else {
    res.redirect("/login");
  }
});

router.get("/find", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("student/find", {
      haveResult: false
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/find", function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role.controlStudents || req.user.role.isAdmin) {
      sequelize.query("CALL `findStudentDetailByName`(:personName);", {
        replacements: {
          personName: req.body.personName,
        }
      }).then(result => {
        result = JSON.parse(JSON.stringify(result));
        if (result[0]) {
          res.render("student/find", {
            studentList: result,
            haveResult: true,
          })
        } else {
          res.render("student/find", {
            haveResult: false
          });
        }
        
      })
      
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
