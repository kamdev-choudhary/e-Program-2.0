import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  subject: { type: Number },
  total: { type: Number },
});

const JeeAdvancedCutoffSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  examName: { type: String, required: true },
  general: categorySchema,
  obc: categorySchema,
  sc: categorySchema,
  st: categorySchema,
  ews: categorySchema,
  generalPwD: categorySchema,
  obcPwD: categorySchema,
  scPwD: categorySchema,
  stPwD: categorySchema,
  ewsPwD: categorySchema,
  preparatory: { subject: Number, total: Number },
});

const JeeAdvancedCutoff = mongoose.model(
  "JEEAdvancedCutoff",
  JeeAdvancedCutoffSchema
);

export default JeeAdvancedCutoff;
