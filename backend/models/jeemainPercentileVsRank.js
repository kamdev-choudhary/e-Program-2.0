import mongoose from "mongoose";

const JEEMainPercentileVsRankSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    percentile: { type: Number, required: true },
    generalRank: { type: Number },
    generalPwdRank: { type: Number },

    obcRank: { type: Number },
    obcPwdRank: { type: Number },

    scRank: { type: Number },
    scPwdRank: { type: Number },

    stRank: { type: Number },
    stPwdRank: { type: Number },

    ewsRank: { type: Number },
    ewsPwdRank: { type: Number },
  },
  { timestamps: true }
);

// Adding an index for faster percentile-based queries
JEEMainPercentileVsRankSchema.index({ year: 1, percentile: 1 });

const JEEMainPercentileVsRank = mongoose.model(
  "JEEMainPercentileVsRank",
  JEEMainPercentileVsRankSchema
);

export default JEEMainPercentileVsRank;
