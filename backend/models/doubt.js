import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const doubtSchema = new Schema({
  postedBy: String,
  postedById: String,
  doubtQuestion: String,
  doubtPostedDate: {
    type: Date,
    default: Date.now,
  },
  doubtSolutions: [
    {
      postedBy: String,
      postedById: String,
      solution: String,
      solutionPostedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Doubt = model("Doubt", doubtSchema);

export default Doubt;
