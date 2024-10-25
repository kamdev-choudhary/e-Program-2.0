const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examPatternSchema = new Schema({
  name: { type: String, required: true },
  subjets: [
    {
      type: String,
    },
  ],
});

const ExamPattern = mongoose.model("ExamPattern", examPatternSchema);

module.exports = ExamPattern;
