const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subSubjectSchema = new Schema({
  id_subject: { type: Number, required: true },
  id_sub_subject: { type: Number, unique: true },
  name: { type: String, required: true },
});

subSubjectSchema.plugin(AutoIncrement, { inc_field: "id_sub_subject" });

const SubSubject = mongoose.model("SubSubject", subSubjectSchema);

module.exports = SubSubject;
