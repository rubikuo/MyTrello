const express = require("express");
const router = express.Router();
const Trello = require("../models/Trello");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Register
router.post("/trello/register", (req, res) => {
  const { username, email, password, repassword } = req.body;
  let errors = [];

  if (!username || !email || !password || !repassword) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password != repassword) {
    errors.push({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.status(400).json({
      errors,
      username,
      email,
      password,
      repassword,
    });
  } else {
    Trello.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ message: "Email already exists" });
        res.status(409).json({
          errors,
          username,
          email,
          password,
          repassword,
        });
      } else {
        const newTrello = new Trello({
          username,
          email,
          password,
          boards: [],
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newTrello.password, salt, (err, hash) => {
            if (err) throw err;
            newTrello.password = hash;
            newTrello
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.status(200).json(user);
              })
              .catch((error) => {
                console.log(error);
                res.status(500).end();
              });
          });
        });
      }
    });
  }
});

router.post("/trello/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      const _user = JSON.parse(JSON.stringify(req.user)); // hack
      const cleanUser = Object.assign({}, _user);
      console.log("clean", cleanUser);
      delete cleanUser.password;
      return res.status(200).json({ user: cleanUser });
    });
  })(req, res, next);
});


//Logout
router.post("/trello/logout", (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "logging you out" });
  });
});

module.exports = router;
