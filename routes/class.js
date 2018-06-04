var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

function findAcademicYear(callback) {
  sequelize.query("CALL`findAcademicYear`();").then(result => {
    result = JSON.parse(JSON.stringify(result));
    let year = [];
    let final = [];
    result.forEach((item, index) => {
      item.academicYear = new Date(item.academicYear).getFullYear();
      if (!final.includes(item.academicYear)) {
        final.push(item.academicYear);
        year.push({
          academicYear: item.academicYear,
          detail: [{
            id: item.academicYearID,
            semester: item.semester,
          }],
        })
      } else {
        let values = year.map(d => {
          return d['academicYear'];
        }).indexOf(item.academicYear);
        year[values]['detail'].push({
          id: item.academicYearID,
          semester: item.semester,
        })
      }
      if (result.length - index == 1) {
        callback(JSON.parse(JSON.stringify(year)))
      }
    });

    // for (let i = 0; i < year.length; i++) {
    //   year[i]['detail'] = [];
    //   for (let j = 0 ; j < result.length; j++) {
    //     if (year[i]['academicYear'] == result[j]['academicYear']) {
    //       year[i]['detail'].push({
    //         id: result[j]['academicYearID'],
    //         semester: result[j]['semester'],
    //       })
    //     }
    //     if (year.length - i == 1 && result.length - j == 1) {
    //       callback(JSON.parse(JSON.stringify(year)));
    //     }
    //   }
    // }
  });
};

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
      res.render("class/level", {
        khoi: req.params.level,
        academicYear: academicYear,
        hasListOfClass: false,
        role: req.user.role,
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/:level/:academicYear", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize.query("CALL `showClassDetailWithYear`(:academicYear, :levelClass)", {
      replacements: {
        academicYear: req.params.academicYear,
        levelClass: req.params.level,
      }
    }).then(listOfClass => {
      listOfClass = JSON.parse(JSON.stringify(listOfClass));
        findAcademicYear(academicYear => {
          res.render("class/level", {
            khoi: req.params.level,
            role: req.user.role,
            year: req.params.academicYear,
            academicYear: academicYear,
            listOfClass: listOfClass,
            hasListOfClass: true,
          });
        });
    })
  } else {
    res.redirect("/login");
  }
});

router.get("/:level/:academicYear/:classID", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize.query("CALL `findClassDetail`(:classID)", {
      replacements: {
        classID: req.params.classID
      }
    }).then(classDetail => {
      classDetail = JSON.parse(JSON.stringify(classDetail[0]));
      sequelize.query("CALL `findStudentStudyAtClass`(:classID)", {
        replacements: {
          classID: req.params.classID,
        }
      }).then(data => {
        data = JSON.parse(JSON.stringify(data));
        res.render("class/classDetail", {
          classDetail: classDetail,
          student: data,
          role: req.user.role,
          year: parseInt(req.params.academicYear),
        })
      })
    })
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
