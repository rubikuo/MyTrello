const mongoose = require("mongoose");
// access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

const devConnection = process.env.DB_STRING_DEV;
// const prodConnection = process.env.DB_STRING_PROD;
const connectOptions = { useUnifiedTopology: true, useNewUrlParser: true };

let connection;
// connect to MongoDb
// ES6 Promise
mongoose.Promise = global.Promise;
// connect to MongoDb

mongoose.connect(devConnection, connectOptions);
// make connection instance
connection = mongoose.createConnection(devConnection, connectOptions);

//to check if the connection is sucessful or not
mongoose.connection
  .once("open", function () {
    console.log("Connection has been made...");
  })
  .on("error", function (error) {
    console.log("Connection error: ", error);
  });

module.exports = connection;
