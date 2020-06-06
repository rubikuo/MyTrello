// to create schema to set up data structure

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = require("./Card");

const ListSchema = new Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 15,
    trim: true,
    required: [true, "please enter list title"],
  },
  cards: [CardSchema],
});

module.exports = ListSchema;
