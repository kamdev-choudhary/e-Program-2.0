import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const classSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const Class = model("Class", classSchema);

export default Class;
