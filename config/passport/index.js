const localStrategy = require("passport-local").Strategy;
const sequelize = require("../db/sequelize");
const bcrypt = require("bcrypt-nodejs");

module.exports = passport => {
  //Serialize user for session
  passport.serializeUser((user, done) => {
    let temp = JSON.parse(user);
    done(null, temp.UserID);
  });

  //Deserialize user from session
  passport.deserializeUser((id, done) => {
    sequelize
      .query("SELECT * FROM `users` S WHERE S.UserID = :id", {
        replacements: { id: `${id}` }
      })
      .then(user => {
        let temp = JSON.parse(JSON.stringify(user[0]));
        done(null, temp[0].UserID);
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
          .query("SELECT * FROM `users` S WHERE S.email = :email", {
            replacements: { email: username }
          })
          .then(user => {
            user = user[0];
            user.map(item => {
              if (item) {
                bcrypt.compare(password, item.Password, (err, isMatch) => {
                  if (err) throw err;
                  if (isMatch) {
                    item.passpord = null;
                    return done(null, JSON.stringify(item));
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
