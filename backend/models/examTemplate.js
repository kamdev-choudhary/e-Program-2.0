const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = require("./questions");

const examTemplateSchema = new Schema({
  examId: String,
  examName: String,
  examPattern: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const ExamTemplate = mongoose.model("ExamTemplate", examTemplateSchema);

module.exports = ExamTemplate;
