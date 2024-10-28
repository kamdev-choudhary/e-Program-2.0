const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subSubjectSchema = new Schema({
  id_sub_subject: { type: Number }, // remove unique constraint
  id_subject: { type: Number, required: true }, // ensure this isn't set as unique
  name: { type: String, required: true },
});

subSubjectSchema.plugin(AutoIncrement, { inc_field: "id_sub_subject" });

const SubSubject = mongoose.model("SubSubject", subSubjectSchema);

module.exports = SubSubject;
