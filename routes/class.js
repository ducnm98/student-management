var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

function findAcademicYear(callback) {
  sequelize.query("CALL`showAllAcademicYear`();").then(result => {
    result = JSON.parse(JSON.stringify(result));

    let year = [];

    //result is an array; Using foreach()
    result.map((value, index) => {
      let { academicYear, academicYearID, semester } = value;

      year.push({
        academicYear: new Date(academicYear).getFullYear(),
        id: academicYearID,
        semester: semester
      });
    });

    callback(year);
  });
}

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("class/index");
  } else {
    res.redirect("/login");
  }
});

router.get("/:level", function(req, res, next) {
  if (req.isAuthenticated()) {
    findAcademicYear(academicYear => {
      console.log(academicYear);
      res.render("class/level", {
        level: req.params.level,
        academicYear: academicYear,
        hasListOfClass: false
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/:level/:academicYear", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize
      .query("CALL `findClassByAcademicYear`(:academicYear, :level)", {
        replacements: {
          academicYear: req.params.academicYear,
          level: req.params.level
        }
      })
      .then(listOfClass => {
        listOfClass = JSON.parse(JSON.stringify(listOfClass));
        findAcademicYear(academicYear => {
          console.log(academicYear);
          res.render("class/level", {
            level: req.params.level,
            year: req.params.academicYear,
            academicYear: academicYear,
            listOfClass: listOfClass,
            hasListOfClass: true
          });
        });
      });
  } else {
    res.redirect("/login");
  }
});

router.get("/:level/:academicYear/:classID", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize
      .query("CALL `findClassByID`(:classID)", {
        replacements: {
          classID: req.params.classID
        }
      })
      .then(classDetail => {
        classDetail = JSON.parse(JSON.stringify(classDetail[0]));
        sequelize
          .query("CALL `findStudentByClass`(:classID)", {
            replacements: {
              classID: req.params.classID
            }
          })
          .then(studentData => {
            studentData = JSON.parse(JSON.stringify(studentData));
            studentData.map(value => ddmmyyyy(value.dateOfBirth));
            res.render("class/classDetail", {
              classDetail: classDetail,
              student: studentData,
              year: parseInt(req.params.academicYear)
            });
          });
      });
  } else {
    res.redirect("/login");
  }
});

function ddmmyyyy(date) {
  return date
    .split("-")
    .reverse()
    .join("-");
}

module.exports = router;
