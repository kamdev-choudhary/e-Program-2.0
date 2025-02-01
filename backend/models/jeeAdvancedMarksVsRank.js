import mongoose from "mongoose";

const JEEAdvancedMarksVsRankSchema = new mongoose.Schema({
  year: String,
  marks: Number,
  general: Number,
  obc: Number,
  sc: Number,
  st: Number,
  ews: Number,
  generalPwD: Number,
  obcPwD: Number,
  scPwD: Number,
  stPwD: Number,
  ewsPwD: Number,
  preparatory: Number,
});

const JEEAdvancedMarksVsRank = mongoose.model(
  "JEEAdvancedMarksVsRank",
  JEEAdvancedMarksVsRankSchema
);

export default JEEAdvancedMarksVsRank;
