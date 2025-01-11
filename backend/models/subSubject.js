import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const subSubjectSchema = new Schema({
  id_sub_subject: { type: Number }, // remove unique constraint
  id_subject: { type: Number, required: true }, // ensure this isn't set as unique
  name: { type: String, required: true },
});

const SubSubject = model("SubSubject", subSubjectSchema);

export default SubSubject;
