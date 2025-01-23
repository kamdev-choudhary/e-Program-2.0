import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  year: { type: Number },
  session: { type: String },
  date: { type: Date },
  marks: { type: Number },
  percentile: { type: Number },
  rank: { type: Number },
  generalRank: { type: Number },
  obcRank: { type: Number },
  scRank: { type: Number },
  stRank: { type: Number },
  ewsRank: { type: Number },
  pwdRank: { type: Number },
});

const JEEMainMarksVsRank = mongoose.model("JEEMainMarksVsRank", marksSchema);

export default JEEMainMarksVsRank;
