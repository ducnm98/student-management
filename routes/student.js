var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

function findAcademicYear(callback) {
  sequelize.query("CALL`findAcademicYear`();")
    .then(result => {
      callback(JSON.parse(JSON.stringify(result)));
    })
}

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("student/index", {
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/find", function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role.controlStudents || req.user.role.isAdmin) {
      findAcademicYear((academicYear) => {
        res.render("student/find", {
          academicYear: academicYear,
          haveResult: false,
          role: req.user.role,
        });
      });
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/find", function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role.controlStudents || req.user.role.isAdmin) {
      console.log('academicYearID', req.body.academicYearID)
      sequelize.query("CALL `findStudentDetailByName`(:personName, :academicYearID);", {
        replacements: {
          personName: req.body.personName,
          academicYearID: req.body.academicYearID,
        }
      }).then(result => {
        result = JSON.parse(JSON.stringify(result));
        findAcademicYear((academicYear) => {
          if (result[0]) {
            res.render("student/find", {
              academicYear: academicYear,
              studentList: result,
              haveResult: true,
              role: req.user.role,
            })
          } else {
            res.render("student/find", {
              academicYear: academicYear,
              haveResult: false,
              role: req.user.role,
            });
          }
        })
        
      })
      
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
