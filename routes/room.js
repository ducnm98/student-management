var router = require("express").Router();
const Sequelize = require("sequelize");
var sequelize = require("../config/db/sequelize");

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
      res.redirect('/room')
    }).catch(err => {
      console.log('has err', err)
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
       // approveRole: req.user.role.approveRooms
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
