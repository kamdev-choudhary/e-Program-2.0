import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;
import Question from "./question.js";

const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const examTemplateSchema = new Schema({
  examId: String,
  examName: String,
  examPattern: String,
  examInstruction: String,
  createdAt: {
    type: String,
    default: formatDate(),
  },
  questionTypes: {
    singleCorrect: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      addedQuestions: Number,
      positiveMarks: {
        type: Number,
        default: 0,
      },
      negativeMarks: {
        type: Number,
        default: 0,
      },
      partialMarks: {
        type: Number,
        default: 0,
      },
    },
    multiCorrect: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      addedQuestions: Number,
      positiveMarks: {
        type: Number,
        default: 0,
      },
      negativeMarks: {
        type: Number,
        default: 0,
      },
      partialMarks: {
        type: Number,
        default: 1,
      },
    },
    integerType: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      addedQuestions: Number,
      positiveMarks: {
        type: Number,
        default: 0,
      },
      negativeMarks: {
        type: Number,
        default: 0,
      },
      partialMarks: {
        type: Number,
        default: 0,
      },
    },
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const ExamTemplate = model("ExamTemplate", examTemplateSchema);

export default ExamTemplate;
