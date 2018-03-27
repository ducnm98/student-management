const localStrategy = require("passport-local").Strategy;
const models = require("../models/index");

module.exports = passport => {
  const { Student, Teacher } = models;

  //Serialize user for session
  passport.serializeUser((user, done) => {
    console.log("user serilization: ", user.id);
    done(null, user.id);
  });

  //Deserialize user from session
  passport.deserializeUser((id, done) => {
    Student.findById(id)
      .then((result, err) => {
        console.log("user DEserilization: ", id);
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
            //console.log("An error occured");
            return done(null, false);
          }
          if (!user) {
            //console.log("User not found");
            return done(null, false);
          } else {
            user.compare(password, (result, error) => {
              //console.log(result, error);
              if (error) {
                //console.log("Error while comparing password");
                return done(error, false);
              }
              if (!result) {
                //console.log("Invalid password");
                return done(null, false);
              }
              console.log("Verification successful");
              return done(null, user);
            });
          }
        });
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
