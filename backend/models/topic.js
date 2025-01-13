import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Subtopic = mongoose.model("Subtopic", subtopicSchema);
export default Subtopic;
