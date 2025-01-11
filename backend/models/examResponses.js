import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const examResponsesSchema = new Schema({
  examID: String,
  scholrId: String,
  examTemplate: {
    type: Schema.Types.ObjectId,
    ref: "ExamTemplate",
  },
});

const ExamResponse = model("ExamResponse", examResponsesSchema);

export default ExamResponse;
