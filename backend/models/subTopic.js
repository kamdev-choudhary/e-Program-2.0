import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    subSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubject",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
