const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  optionName: { type: String, required: true },
});

const questionSchema = new Schema({
  className: String,
  questionId: String,
  subject: String,
  topic: String,
  subtopic: String,
  difficultyLevel: String,
  questionType: String,
  timeRequired: String,
  target: String,
  isApproved: {
    type: String,
    default: "No",
  },
  questionText: String,
  options: [optionSchema],
  correctAnswer: String,
  solution: String,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
