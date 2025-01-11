import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const patternSchema = new Schema({
  id_pattern: { type: Number },
  name: { type: String, required: true },
  description: String,
});

const Pattern = model("Pattern", patternSchema);

export default Pattern;
