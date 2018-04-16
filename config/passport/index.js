const localStrategy = require("passport-local").Strategy;
const sequelize = require("../db/sequelize");
const bcrypt = require("bcrypt-nodejs");

Student.prototype.hash = function() {
  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(this.password, salt, null, (err, result) => {
      return (this.password = result);
    });
  });
};

// Instance method for comparing password
Student.prototype.compare = function(password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (err) cb(null, err);
    cb(result, null);
  });
};

module.exports = passport => {
  const { Student } = models;

  //Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //Deserialize user from session
  passport.deserializeUser((id, done) => {
    sequelize
      .query("SELECT * FROM `student` S WHERE S.id = :id", {
        replacements: { id: `${id}` }
      })
      .then(user => {
        done(null, users[0].id);
      })
      .catch(err => done(err, null));
  });

  //Define local login strategy
  passport.use(
    "local-login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, username, password, done) {
        
        sequelize
          .query("SELECT * FROM `student` S WHERE S.email = :email", {
            replacements: { email: username }
          })
          .then(user => {
            user = user[0];
            if (user) {
              bcrypt.compare(user.password, this.password, (err, result) => {
                if (err) throw err;
                user.passport = null;
                return done(null, user);
              });
            } else {
              return done(null, false);
            }
          })
          .catch(err => done(err, false));
      }
    )
  );

  passport.use('local-register', 
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, username, password, done) {
        Teacher.findOne({ where: { email: username } }).then((user, err) => {
          if (err) return done(null, false);
  
          if(user) { return done(null, false); }
          else {
            var userData = Teacher.build({
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              email: req.body.email,
              password: req.body.password,
            });
      
            userData.hash((result, error) => {
              userData.password = result;
              //console.log(userData.id, result);
              userData.save()
              .then((data, err) => {
                return done(null, data);
              });
            });
          }
        });
      }
    )
  );

};