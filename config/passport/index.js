const localStrategy = require('passport-local').Strategy;
const models = require('../models/index');

module.exports = (passport) => {
    const { Student } = models;

    //Serialize user for session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //Deserialize user from session
    passport.deserializeUser((id, done) => {
        Student
        .findById(id)
        .then((result, err) => {
            done(err, result);
        })
        .catch(error => done(null, error))
    });

    //Define local login strategy
    passport.use('local-login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
        function(req, username, password, done) {
            console.log("Begin searching");
            Student
            .findOne({ where: { email: username } })
            .then((user, err) => {
                if(err) {
                    console.log("Error");
                    return done('Error', false);
                }

                if(!user) {
                    console.log("User not found");
                    return done('User not found', false);
                }

                else {
                    user.compare(password, (result, error) => {
                        if(error) {
                            console.log("Error while comparing");
                            return done(error, null);
                        }
                        
                        if(!result) {
                            console.log("Invalid password");
                            return done("Invalid password", null);
                        }

                        console.log("Verification successful");
                        return done(null, user);
                    });
                }
            })
        }
    ));
};