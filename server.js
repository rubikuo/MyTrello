// 當在develop的狀態下 使用local的ENV file(因為有密碼等資料所以不會上傳到github)
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
/******** get the mongo connection instance *****/
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

// 注意如果deploy到Heroku 必須把這個route 放在以下 production 的設定之前
app.use("/auth", authRoute);
app.use("/api", trelloRoute);

if (process.env.NODE_ENV === "production") {
  console.log("production!");
  // relative path to build folder in react app
  app.use(express.static(path.join(__dirname + "/trelloapp/build")));
  // relative path to index.html file in react app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "trelloapp", "build", "index.html"));
  });
}

// 這個route 放在production 的設定之後
app.use("/", baseRoute);

app.listen(PORT, () => {
  console.log(`Server is on ${PORT}`);
});
