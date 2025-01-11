import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const examPatternSchema = new Schema({
  name: { type: String, required: true },
  subjets: [
    {
      type: String,
    },
  ],
});

const ExamPattern = model("ExamPattern", examPatternSchema);

export default ExamPattern;
