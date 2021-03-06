var router = require("express").Router();
const Sequelize = require("sequelize");
var sequelize = require("../config/db/sequelize");
var moment = require('moment');

function findRentalDetail(date, callback){
  sequelize.query("CALL `showRoom`(:dateWeek)", {
    replacements: {
      dateWeek: date,
    }
  }).then(listRoom => {
    // listRoom = JSON.parse(JSON.stringify(listRoom));
    listRoom.forEach((item, index) => {
      if (item.roomRentalID != null) {
        sequelize.query("CALL `showRoomRental`(:roomRentalID)", {
          replacements: {
            roomRentalID: item.roomRentalID,
          }
        }).then(data => {
          listRoom[index]['roomRentalDetail'] = JSON.parse(JSON.stringify(data[0]));
        })
      }
      if (listRoom.length - index == 1) {
        callback(JSON.parse(JSON.stringify(listRoom)));
      }
    })
  }) 
}

router.post("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    let temp = new Date(req.body.registerDate);
    if (req.body.registerDate === undefined) 
      temp = new Date();
    findRentalDetail(temp, listRoom => {
      res.render("room/index", {
        room: listRoom,
        hasSubmit: true,
        recipientType: req.body.recipientType,
        registerDate: req.body.registerDate,
        note: req.body.note,
        success: '',
      });
    })
  } else {
    res.redirect("/login");
  }
});

// router.post("/register", function(req, res, next) {
//   if (req.isAuthenticated()) {
//     sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED}).then(t => {
//       return sequelize.query("CALL `registerRoom`(:roomID, :recipientID, :recipientType, :rentalDate, :note)", {
//         replacements: {
//           roomID: req.body.register,
//           recipientID: req.user.personID,
//           recipientType: req.body.recipientType,
//           rentalDate: req.body.registerDate,
//           note: req.body.note,
//         }
//       })
//     }).then(data => {
//       console.log('data');
//       console.log(data);
//       res.redirect('/room');
//     }).catch(err => {
//       console.log('has err', err)
//     })
//   } else {
//     res.redirect("/login");
//   }
// });

router.post("/register", function(req, res, next) {
  if (req.isAuthenticated()) {
    sequelize.query("CALL `registerRoom`(:roomID, :recipientID, :recipientType, :rentalDate, :note)", {
      replacements: {
        roomID: req.body.register,
        recipientID: req.user.personID,
        recipientType: req.body.recipientType,
        rentalDate: req.body.registerDate,
        note: req.body.note,
      }
    }).then(data => {
      res.redirect('/room/success')
    }).catch(err => {
      console.log('has err', err)
    })
  } else {
    res.redirect("/login");
  }
});

router.post("/approve", (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.body.approve) {
      console.log(req.body.approve)
      sequelize.query("CALL `approveRoom`(:roomRentalID, :approvalID)", {
        replacements: {
          roomRentalID: req.body.approve,
          approvalID: req.user.personID,
        }
      }).then(data => {
        res.redirect("/room/approve")
      })
    } else if (req.body.disagree) {
      sequelize.query("CALL `disapproveRoom`(:roomRentalID)", {
        replacements: {
          roomRentalID: req.body.disagree,
        }
      }).then(data => {
        res.redirect("/room/approve")
      })
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/return", (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.body.return);
    sequelize.query("CALL `returnRoom`(:roomRentalID, :returnDate)", {
      replacements: {
        roomRentalID: req.body.return,
        returnDate: new Date(),
      }
    }).then(data => {
      res.redirect("/room/return")
    })
  } else {
    res.redirect("/login");
  }
});

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("room/index", {
      hasSubmit: false,
      room: [],
      registerDate: 'yyyy/mm/dd',
      recipientType: '',
      note: '',
      success: '',
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/success", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("room/index", {
      hasSubmit: false,
      room: [],
      registerDate: 'yyyy/mm/dd',
      recipientType: '',
      note: '',
      success: 'Your register has been successful registered, and waiting for approving',
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/approve", (req, res, next) => {
  if (req.isAuthenticated()) {
    sequelize.query("CALL showRoomWaiting()")
    .then(data => {
      data = JSON.parse(JSON.stringify(data));
      console.log(data)
      res.render("room/approve", {
        success: '',
        room: data,
      });
    })
  } else {
    res.redirect("/login");
  }
});

router.get("/return", (req, res, next) => {
  if (req.isAuthenticated()) {
    sequelize.query("CALL showRoomRentaling()")
    .then(data => {
      data = JSON.parse(JSON.stringify(data));
      console.log(data)
      res.render("room/return", {
        success: '',
        room: data,
      });
    })
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
