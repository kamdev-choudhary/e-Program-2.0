const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question_id: String,
  subject: String,
  topic: String,
  Subtopic: String,
  Difficulty_level: String,
  questionType: Number,
  isApproved: {
    type: String,
    default: "no",
  },
  questionText: String,
  options: {
    option1: String,
    option2: String,
    option3: String,
    option4: String,
  },
  correctAnswer: Number,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
