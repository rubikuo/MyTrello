const mongoose = require("mongoose");
const BoardSchema = require("./Board");
const Schema = mongoose.Schema;
const connection = require("../config/database");

const TrelloSchema = new Schema({
  username: {
    type: String,
    minlength: 1,
    maxlength: 15,
    trim: true,
    required: [true, "please enter username"],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "please enter email"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "please enter password"],
  },
  boards: [BoardSchema],
  data: {
    type: Date,
    default: Date.now,
  },
});

// create collection with connection instance
const Trello = connection.model("trellos", TrelloSchema);
module.exports = Trello;
