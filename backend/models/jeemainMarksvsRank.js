import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    session: {
      type: String,
      required: [true, "Session is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    marks: {
      type: Number,
      required: [true, "Marks are required"],
      min: [0, "Marks cannot be negative"],
      max: [300, "Marks cannot exceed 300"],
    },
    percentile: {
      type: Number,
      required: [true, "Percentile is required"],
    },
    rank: {
      type: Number,
      required: [true, "Common rank is required"],
    },
    categoryRanks: {
      generalRank: { type: Number, min: 1 },
      obcRank: { type: Number, min: 1 },
      scRank: { type: Number, min: 1 },
      stRank: { type: Number, min: 1 },
      ewsRank: { type: Number, min: 1 },
      pwdRank: { type: Number, min: 1 },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for faster querying
marksSchema.index({ marks: 1 });
marksSchema.index({ year: 1 });
marksSchema.index({ percentile: 1 });

const JEEMainMarksVsRank = mongoose.model("JEEMainMarksVsRank", marksSchema);

export default JEEMainMarksVsRank;
