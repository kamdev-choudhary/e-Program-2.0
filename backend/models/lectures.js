const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  class: String,
  subject: String,
  chapter_name: String,
  lecture_number: Number,
  video_link: String,
});

const Lecture = mongoose.model("Lectures", lectureSchema);

module.exports = Lecture;
