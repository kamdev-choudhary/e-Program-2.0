import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const patternSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Pattern = model("Pattern", patternSchema);

export default Pattern;
