const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = new Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 15,
    trim: true,
    required: [true, "please enter card title"],
  },
  desc: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = CardSchema;
