const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  title: String,
  author: String,
  subject: String,
  class: String,
  catagory: String,
  publishigYear: String,
  addedAt: {
    type: Date,
    default: Date.now(),
  },
  pdf: {
    url: String,
    filename: String,
  },
});

const Question = mongoose.model("Library", librarySchema);

module.exports = Question;
