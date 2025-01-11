import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

// Option schema for multiple-choice questions
const optionSchema = new Schema({
  optionName: { type: String, required: true },
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

// Schema for integer-type answers (e.g., numeric answers)
const integerAnswerSchema = new Schema({
  answer: { type: String, required: true },
});

const questionSchema = new Schema(
  {
    idQuestion: { type: Number },
    idParagraph: { type: Number },
    questionClass: { type: String },
    subject: { type: String, required: true },
    topic: { type: String },
    subTopic: { type: String },
    difficultyLevel: { type: String },
    questionType: {
      type: String,
      enum: [
        "SingleCorrect",
        "MultipleCorrect",
        "Integer",
        "Numerical",
        "Comprehension",
        "MatrixBasedSingleCorrect",
        "Match",
      ],
      required: true,
    },
    timeRequired: { type: String },
    target: { type: String },
    isApproved: {
      type: String,
      enum: ["No", "Yes"],
      default: "No",
    },

    questionText: { type: String, required: true },

    // Different types of answers depending on questionType
    options: {
      type: [optionSchema],
      validate: {
        validator: function (v) {
          return this.questionType === "SingleCorrect" ||
            this.questionType === "MultipleCorrect" ||
            this.questionType === "MatrixBasedSingleCorrect" ||
            this.questionType === "Match"
            ? v && v.length > 0
            : true;
        },
        message: "Options are required for multiple-choice questions.",
      },
    },
    correctAnswers: {
      type: [String],
      validate: {
        validator: function (v) {
          return (
            ((this.questionType === "SingleCorrect" ||
              this.questionType === "MultipleCorrect") &&
              v.length > 0) ||
            ((this.questionType === "Match" ||
              this.questionType === "MatrixBasedSingleCorrect") &&
              v.length > 0) ||
            true
          );
        },
        message: "Correct answers are required based on the question type.",
      },
    },
    integerAnswer: {
      type: integerAnswerSchema,
      validate: {
        validator: function (v) {
          return this.questionType === "Integer" ||
            this.questionType === "Numerical"
            ? v && v.answer !== undefined
            : true;
        },
        message: "Integer answer is required for Integer type questions.",
      },
    },
    paragraphText: {
      type: String,
      validate: {
        validator: function (v) {
          return this.questionType === "Comprehension"
            ? v && v.length > 0
            : true;
        },
        message: "Paragraph text is required for Comprehension questions.",
      },
    },
    solution: { type: String },
  },
  { timestamps: true }
);

// Add auto-increment for idQuestion field

const Question = model("Question", questionSchema);

export default Question;
