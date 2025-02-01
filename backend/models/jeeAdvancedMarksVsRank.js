import mongoose from "mongoose";

const JEEAdvancedMarksVsRankSchema = new mongoose.Schema(
  {
    year: String,
    marks: Number,
    generalRank: Number,
    obcRank: Number,
    scRank: Number,
    stRank: Number,
    ewsRank: Number,
    generalPwDRank: Number,
    obcPwDRank: Number,
    scPwDRank: Number,
    stPwDRank: Number,
    ewsPwDRank: Number,
    preparatoryRank: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const JEEAdvancedMarksVsRank = mongoose.model(
  "JEEAdvancedMarksVsRank",
  JEEAdvancedMarksVsRankSchema
);

export default JEEAdvancedMarksVsRank;
