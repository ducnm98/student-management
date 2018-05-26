var router = require("express").Router();
const passport = require("passport");
var sequelize = require("../config/db/sequelize");

router.get("/:classID/:academicYearID", function(req, res, next) {
  if (!req.isAuthenticated()) {
    sequelize.query("CALL `findGrade` (:classID, :academicYearID)", {
      replacements: {
        classID: req.params.classID,
        academicYearID: req.params.academicYearID
      }
    }).then(data => {
      let col = [];
      let studentID = [];
      let grade = [];
      for (let i = 0; i < data.length; i++) {
        if (col.indexOf(data[i]['subjectName']) === -1) 
          col.push(data[i]['subjectName']);
          
        if (studentID.indexOf(data[i]['studentID']) === -1) {
          studentID.push(data[i]['studentID']);
          grade.push({
            studentID: data[i]['studentID'],
            studentName: data[i]['name'],
            subjects: [{
              subjectID: data[i]['subjectID'],
              subjectName: data[i]['subjectName'],
              points: (parseFloat(data[i]['oralScore']) + parseFloat(data[i]['fifteenMinutesScore']) + parseFloat(data[i]['periodScore'])*2 + parseFloat(data[i]['finalScore'])*3) / 7
            }]
          });
        } else {
          grade[grade.length - 1]['subjects'].push({
            subjectID: data[i]['subjectID'],
            subjectName: data[i]['subjectName'],
            points: (parseFloat(data[i]['oralScore']) + parseFloat(data[i]['fifteenMinutesScore']) + parseFloat(data[i]['periodScore'])*2 + parseFloat(data[i]['finalScore'])*3) / 7
          })
        }
      }
      sequelize.query(" CALL `findClassDetail` (:classID)", {
        replacements: {
          classID: req.params.classID
        }
      }).then(classDetail => {
        classDetail = JSON.parse(JSON.stringify(classDetail));
        sequelize.query("CALL `findAcademicYearDetail` (:academicYearID)", {
          replacements: {
            academicYearID: req.params.academicYearID
          }
        }).then(academicYear => {
          console.log(classDetail)
          res.render("report/index", {
            classDetail: classDetail[0],
            grade: grade,
            academicYear: academicYear[0],
            col: col
          })
        })
        
      })
    })
  } else {
    res.redirect("/login");
  }
});



module.exports = router;
