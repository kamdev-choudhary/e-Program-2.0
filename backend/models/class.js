import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const classSchema = new Schema({
  id_class: { type: Number, unique: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const Class = model("Class", classSchema);

export default Class;
