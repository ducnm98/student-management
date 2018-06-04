var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

Array.prototype.sum = Array.prototype.sum || function() {
  return this.reduce(function(sum, a) { return sum + Number(a) }, 0);
}

Array.prototype.average = Array.prototype.average || function() {
  return this.sum() / (this.length || 1);
}

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
  });
};

router.get("/detail/:level/:academicYear/:classID", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize.query("CALL `findGrade` (:classID, :academicYear)", {
      replacements: {
        classID: req.params.classID,
        academicYear: req.params.academicYear
      }
    }).then(data => {
      let col = [];
      let studentID = [];
      let grade = [];
      let points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < data.length; i++) {
        if (col.indexOf(data[i]['subjectName']) === -1) 
          col.push(data[i]['subjectName']);
        
          let temp = ((parseFloat(data[i]['oralScore']) + parseFloat(data[i]['fifteenMinutesScore']) + parseFloat(data[i]['periodScore'])*2 + parseFloat(data[i]['finalScore'])*3) / 7).toFixed(2);
        if (studentID.indexOf(data[i]['studentID']) === -1) {
          studentID.push(data[i]['studentID']);
          grade.push({
            studentID: data[i]['studentID'],
            studentName: data[i]['name'],
            subjects: [{
              subjectID: data[i]['subjectID'],
              subjectName: data[i]['subjectName'],
              points: temp
            }]
          }); 
        } else {
          grade[grade.length - 1]['subjects'].push({
            subjectID: data[i]['subjectID'],
            subjectName: data[i]['subjectName'],
            points: temp
          })
        }
      }
      sequelize.query(" CALL `findClassDetail` (:classID)", {
        replacements: {
          classID: req.params.classID
        } 
      }).then(classDetail => {
        classDetail = JSON.parse(JSON.stringify(classDetail));        
        grade.map((item, index) => {
          let average = item.subjects.map(point => {
            return point.points;
          })
          points[Math.round(average.average())]++
        })
        console.log(points)
        // let studentType = {
        //   good: points.filter(points => points >= 8 & points <= 10),
        //   normal: points.filter(points => points >= 6.5 & points < 8),
        //   average: points.filter(points => points >= 5 & points < 6.5),
        //   weak: points.filter(points => points >= 3 & points < 5),
        //   retention: points.filter(points => points < 3 & points > 0)
        // }
        let studentType = {
          good: points[10] + points[9] + points[8],
          normal: points[6] + points[7],
          average: points[5],
          weak: points[3] + points[4],
          retention: points[0] + points[1] + points[2]
        }
        console.log(studentType)
        res.render("report/classreport", {
          classDetail: classDetail[0],
          grade: grade,
          academicYear: req.params.academicYear,
          col: col,
          points: points,
          role: req.user.role,
          studentType: studentType,
        })
        
      })
    })
  } else {
    res.redirect("/login");
  }
});

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("report/index", {
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/detail", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("report/report", {
      role: req.user.role,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/detail/:level", function(req, res, next) {
  if (req.isAuthenticated()) {
    findAcademicYear(academicYear => {
      console.log('academicYear:', academicYear);
      res.render("report/level", {
        khoi: req.params.level,
        academicYear: academicYear,
        role: req.user.role,
        hasListOfClass: false,
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/detail/:level/:academicYear", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize.query("CALL `showClassDetailWithYear`(:academicYear, :levelClass)", {
      replacements: {
        academicYear: req.params.academicYear,
        levelClass: req.params.level,
      }
    }).then(listOfClass => {
      listOfClass = JSON.parse(JSON.stringify(listOfClass));
        findAcademicYear(academicYear => {
          res.render("report/level", {
            khoi: req.params.level,
            year: req.params.academicYear,
            academicYear: academicYear,
            listOfClass: listOfClass,
            hasListOfClass: true,
            role: req.user.role,
          });
        });
    })
  } else {
    res.redirect("/login");
  }
});

// router.get("/:level/:academicYear/:classID", function(req, res, next) {
//   if (req.isAuthenticated()) {
//     sequelize.query("CALL `findClassDetail`(:classID)", {
//       replacements: {
//         classID: req.params.classID
//       }
//     }).then(classDetail => {
//       classDetail = JSON.parse(JSON.stringify(classDetail[0]));
//       sequelize.query("CALL `findStudentStudyAtClass`(:classID)", {
//         replacements: {
//           classID: req.params.classID,
//         }
//       }).then(data => {
//         data = JSON.parse(JSON.stringify(data));
//         res.render("class/classDetail", {
//           classDetail: classDetail,
//           student: data,
//           year: parseInt(req.params.academicYear),
//         })
//       })
//     })
//   } else {
//     res.redirect("/login");
//   }
// });




module.exports = router;
