const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  classes: String,
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
    default: "no",
  },
  questionText: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  correctAnswer: String,
  solution: String,
  inTemplateId: [
    {
      type: String,
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
