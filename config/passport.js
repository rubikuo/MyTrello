const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const Trello = require("../models/Trello");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user email
      Trello.findOne({
        email: email.toLocaleLowerCase(),
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Trello.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
