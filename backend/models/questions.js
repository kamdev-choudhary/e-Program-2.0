const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Option schema for multiple-choice questions
const optionSchema = new Schema({
  optionName: { type: String, required: true },
});

// Schema for integer-type answers (e.g., numeric answers)
const integerAnswerSchema = new Schema({
  answer: { type: String },
});

const questionSchema = new Schema(
  {
    className: { type: String },
    idQuestion: { type: Number },
    idParagraph: { type: Number },
    subject: { type: String, required: true },
    topic: { type: String },
    subtopic: String,
    difficultyLevel: { type: String },
    questionType: {
      type: String,
      enum: [
        "SingleCorrect", // Single correct option
        "MultipleCorrect", // Multiple correct options
        "Integer", // Numeric answers
        "Numerical", // Numerical value
        "Comprehension", // Paragraph or comprehension-based
        "MatrixBasedSingleCorrect", // Matrix match
        "Match", // Match the following
      ],
      required: true,
    },
    timeRequired: String,
    target: String,
    isApproved: {
      type: String,
      enum: ["No", "Yes"],
      default: "No",
    },
    questionText: { type: String, required: true },
    options: {
      type: [optionSchema],
    },
    correctAnswers: {
      type: [String],
    },
    integerAnswer: { type: integerAnswerSchema },
    paragraphText: { type: String },
    solution: String,
  },
  { timestamps: true }
);

questionSchema.plugin(AutoIncrement, { inc_field: "idQuestion" });

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
