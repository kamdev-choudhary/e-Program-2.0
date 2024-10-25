const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subSubjectSchema = new Schema({
  id_sub_subject: { type: String, required: true },
  id_subject: { type: String, required: true },
  name: { type: String, required: true },
});

const subSubject = mongoose.model("subSubject", subSubjectSchema);

module.exports = subSubject;
