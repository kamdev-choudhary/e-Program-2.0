import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const doubtSchema = new Schema(
  {
    // Details about the doubt
    doubtQuestion: { type: String, required: true },
    description: { type: String }, // Optional detailed description of the doubt
    subject: { type: String, required: true }, // Subject related to the doubt
    tags: { type: [String], default: [] }, // Tags for easier search and categorization

    // User who posted the doubt
    postedBy: { type: String }, // User's name
    postedById: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the user model

    // Status and metadata
    status: { type: String, enum: ["unsolved", "solved"], default: "unsolved" }, // Status of the doubt
    upvotes: { type: Number, default: 0 }, // Number of upvotes
    downvotes: { type: Number, default: 0 }, // Number of downvotes
    doubtPostedDate: { type: Date, default: Date.now }, // Timestamp for when the doubt was posted

    // Array of solutions
    doubtSolutions: [
      {
        postedBy: { type: String, required: true }, // User's name
        postedById: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        }, // Reference to the user model
        solution: { type: String, required: true }, // Solution content
        solutionPostedDate: { type: Date, default: Date.now }, // Timestamp for when the solution was posted
        upvotes: { type: Number, default: 0 }, // Upvotes for the solution
        downvotes: { type: Number, default: 0 }, // Downvotes for the solution
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Doubt = model("Doubt", doubtSchema);

export default Doubt;
