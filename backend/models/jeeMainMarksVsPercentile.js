import mongoose from "mongoose";

const JEEMainMarksVsPercentileSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  session: { type: String, required: true },
  date: { type: Date },
  shift: { type: String },
  marks: { type: Number },
  percentile: { type: Number },
});

const JEEMainMarksVsPercentile = mongoose.model(
  "JEEMainMarksVsPercentile",
  JEEMainMarksVsPercentileSchema
);

export default JEEMainMarksVsPercentile;
