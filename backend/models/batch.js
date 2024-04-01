const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExamTemplate = require("./examTemplate");
const User = require("./user");

const batchSchema = new Schema({
  batchName: String,
  batchClass: String,
  batchStream: String,
  scholars: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  exams: [
    {
      type: Schema.Types.ObjectId,
      ref: "examTemplate",
    },
  ],
});

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
