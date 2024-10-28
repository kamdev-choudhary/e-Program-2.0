const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subjectSchema = new Schema({
  id_subject: { type: Number, unique: true },
  name: { type: String, required: true },
});

subjectSchema.plugin(AutoIncrement, { inc_field: "id_subject" });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
