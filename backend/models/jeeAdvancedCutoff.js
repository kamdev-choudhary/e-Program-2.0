import mongoose from "mongoose";

const JeeAdvancedCutoffSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  examName: { type: String, required: true },
  marks: Number,
  general: { subject: Number, total: Number },
  obc: { subject: Number, total: Number },
  sc: { subject: Number, total: Number },
  st: { subject: Number, total: Number },
  ews: { subject: Number, total: Number },
  generalPwD: { subject: Number, total: Number },
  obcPwD: { subject: Number, total: Number },
  scPwD: { subject: Number, total: Number },
  stPwD: { subject: Number, total: Number },
  ewsPwD: { subject: Number, total: Number },
  preparatory: { subject: Number, total: Number },
});

const JeeAdvancedCutoff = mongoose.model(
  "JEEAdvancedCutoff",
  JeeAdvancedCutoffSchema
);

export default JeeAdvancedCutoff;
