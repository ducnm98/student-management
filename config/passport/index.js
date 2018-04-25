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
    // Search user info and role of this user then I merge 2 JSON object to return value of them
    sequelize
      .query("SELECT * FROM `users` S WHERE S.userID = :id", {
        replacements: { id: id }
      })
      .then(user => {
        user = JSON.parse(JSON.stringify(user[0]));
        // Set user password to null for better security
        user[0].password = null;
        sequelize.query("SELECT * FROM `roles` R WHERE R.roleID = :id", {
          replacements: { id: user[0].roleID }
        }).then(permission => {
          permission = JSON.parse(JSON.stringify(permission[0]));
          user[0].role = permission[0];
          done(null, user[0]);
        });
      })
      .catch(err => done(err, null));
  });

  //Define local login strategy
  passport.use(
    "local-login",
    new localStrategy(
      {
        usernameField: "identifyCard",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, identifyCard, password, done) {
        //Set cookie expiration with option 'Remember Me'
        if(req.body.rememberme) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //Expries after 30 days
        else req.session.cookie.expires = false;

        sequelize
          .query("SELECT * FROM `users` S WHERE S.personID = :identifyCard", {
            replacements: { identifyCard: identifyCard }
          })
          .then(user => {
            user = JSON.parse(JSON.stringify(user[0]));
            if (user[0]) {
              bcrypt.compare(password, user[0].password, (err, isMatch) => {
                if (err) throw (err);
                if (isMatch) {
                  user[0].password = null;
                  return done(null, JSON.parse(JSON.stringify(user[0])));
                } else {
                  return done(null, false);
                }
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
