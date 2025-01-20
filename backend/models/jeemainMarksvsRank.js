import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  examYear: {
    type: Number,
    required: true, // e.g., 2024, 2025
  },
  examSession: {
    type: String,
    required: true, // e.g., "January", "April"
  },
  marks: {
    type: Number,
    required: true, // Specific marks (e.g., 200)
  },
  percentile: {
    type: Number,
    required: true, // Specific percentile (e.g., 99.5)
  },
  rank: {
    type: Number,
    required: true, // Overall rank for the specific marks
  },
  generalRank: {
    type: Number,
    required: true, // Rank for General category
  },
  obcRank: { type: Number },
  scRank: { type: Number },
  stRank: { type: Number },
  ewsRank: { type: Number },
  pwdRank: { type: Number },
});

const JEEMainMarksVsRank = mongoose.model("JEEMainMarksVsRank", marksSchema);

export default JEEMainMarksVsRank;
