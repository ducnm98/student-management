const localStrategy = require("passport-local").Strategy;
const sequelize = require("../db/sequelize");
const bcrypt = require("bcrypt-nodejs");

module.exports = passport => {
  //Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.userID);
  });

  //Deserialize user from session
  passport.deserializeUser((id, done) => {
    sequelize
      .query("SELECT * FROM `USERS` S WHERE S.userID = :id", {
        replacements: { id: `${id}` }
      })
      .then(user => {
        let temp = JSON.parse(JSON.stringify(user[0]));
        done(null, temp[0].userID);
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
      function(req, email, password, done) {
        sequelize
          .query("SELECT * FROM `USERS` S WHERE S.email = :email", {
            replacements: { email: email }
          })
          .then(user => {
            user = user[0];
            user.map(item => {
              if (item) {
                bcrypt.compare(password, item.password, (err, isMatch) => {
                  if (err) throw err;
                  if (isMatch) {
                    item.passpord = null;
                    return done(null, JSON.parse(JSON.stringify(item)));
                  }
                });
              } else {
                return done(null, false);
              }
            });
          })
          .catch(err => done(err, false));
      }
    )
  );
};
