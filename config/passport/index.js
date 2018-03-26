const localStrategy = require("passport-local").Strategy;
const models = require("../models/index");

module.exports = passport => {
  const { Student } = models;

  //Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //Deserialize user from session
  passport.deserializeUser((id, done) => {
    Student.findById(id)
      .then((result, err) => {
        done(err, result);
      })
      .catch(error => done(error, null));
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
        Student.findOne({ where: { email: username } }).then((user, err) => {
          if (err) return done(err, false);
          if (user) {
            user.compare(password, (result, err) => {
              if (err) return done(err, false);
              user.password = null;
              if (result) return done(null, user);
            });
          } else {
            return done(null, false);
          }
        });
      }
    )
  );
};
