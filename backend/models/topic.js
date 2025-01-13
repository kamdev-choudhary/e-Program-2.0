import mongoose from "mongoose";
import SubTopic from "./subTopic.js";

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    subjectName: String,
    subSubjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubject",
      required: true,
    },
    subSubjectName: String,
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

topicSchema.pre("findOneAndDelete", async function (next) {
  const topicId = this.getQuery()._id;
  await SubTopic.deleteMany({ topicId });
  next();
});

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
