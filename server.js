// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8020;
const baseRoute = require("./routes/baseRoute");
const trelloRoute = require("./routes/trelloRoute");
const authRoute = require("./routes/authRoute");
const session = require("express-session");
// get the connection instance
const connection = require("./config/database");
const flash = require("express-flash");
const passport = require("passport");
/*******  Passport Authentication *****/
require("./config/passport")(passport);


//session Store, to store session's information
const MongoStore = require("connect-mongo")(session);
const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day(1 day * 24 hr/1day * 60min/1hr * 60secs/min)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//parse json
// app.use(express.json());
app.use((req, res, next) => {
  // Check that Content-Type: application/json
  if (req.is("json")) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", () => {
      try {
        data = JSON.parse(data);
        req.body = data;
        next();
      } catch (e) {
        res.status(400).end();
      }
    });
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: true }));

// middleware to log each request's method, path and response status and request time
app.use((req, res, next) => {
  // once the request is recieved
  let start = Date.now(); // we get the current time
  // wait the response to be completed
  res.once("finish", () => {
    let end = Date.now(); // the time after response is completed
    let time = end - start; // calculate the request process time
    console.log(req.method, req.path, res.statusCode, time + "ms");
  });

  next();
});
console.log("hej")
app.use("/", baseRoute);
console.log("hello")
app.use("/api", trelloRoute);
console.log("hello2")
app.use("/auth", authRoute);

// if(process.env.NODE_ENV === "production"){
//   console.log("production!");
//   app.use(express.static(path.join(__dirname + "/trelloapp/build")));
//   app.get("/*", (req, res)=>{
//     res.sendFile(path.join(__dirname, '/trelloapp/build', 'index.html'))
// });
// }
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server is on ${PORT}`);
});
