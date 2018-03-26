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
          if (err) {
            return done("Error", false);
          }
          if (!user) {
            return done("User not found", false);
          } else {
            user.compare(password, (result, error) => {
              if (error) {
                return done(error, null);
              }
              if (!result) {
                return done("Invalid password", null);
              }
              return done(null, user);
            });
          }
        });
      }
    )
  );
};
