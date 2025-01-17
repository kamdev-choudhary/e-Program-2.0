import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JeeorcrSchema = new Schema({
  year: { type: String },
  jee: { type: String },
  institute: { type: String },
  programName: { type: String },
  quota: { type: String },
  seatType: { type: String },
  gender: { type: String },
  openingRank: { type: String },
  closingRank: { type: String },
});

const Jeeorcr = mongoose.model("Jeeorcr", JeeorcrSchema);

export default Jeeorcr;
