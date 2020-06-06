const mongoose = require("mongoose");

const ListSchema = require("./List");

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 15,
    trim: true,
    required: [true, "please enter board title"],
  },
  lists: [ListSchema],
});

module.exports = BoardSchema;
