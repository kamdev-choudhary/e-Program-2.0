const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doubtSchema = new Schema({
  postedBy: String,
  posttedById: String,
  doubtQuestion: String,
  doubtSolutions: [{ type: String }],
});

const Doubt = mongoose.model("Doubt", doubtSchema);

module.exports = Doubt;
