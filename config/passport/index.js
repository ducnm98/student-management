const localStrategy = require("passport-local").Strategy;
const sequelize = require("../db/sequelize");
const bcrypt = require("bcrypt-nodejs");

module.exports = passport => {
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
};