import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JEEMainocSchema = new Schema({
  year: { type: String },
  institute: { type: String },
  programName: { type: String },
  quota: { type: String },
  seatType: { type: String },
  gender: { type: String },
  openingRank: { type: String },
  closingRank: { type: String },
});

const JEEMainOC = mongoose.model("JEEMainOC", JEEMainocSchema);

export default JEEMainOC;
