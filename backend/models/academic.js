const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema({
  class: String,
  subject: String,
  topic: String,
});

const Academic = mongoose.model("Class", academicSchema);

module.exports = Academic;
