import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const batchSchema = new Schema({
  batchName: {
    type: String,
    required: true,
  },
  batchClass: String,
  batchStream: String,
  batchYear: String,
  scholars: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  examTemplates: [
    {
      type: Schema.Types.ObjectId,
      ref: "ExamTemplate",
    },
  ],
  slots: [
    {
      examTemplateId: String,
      examDate: String,
      examStartTime: String,
      examEndTime: String,
    },
  ],
});

const Batch = model("Batch", batchSchema);

export default Batch;
