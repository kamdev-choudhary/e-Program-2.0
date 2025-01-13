import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema(
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
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    topicName: String,
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Subtopic = mongoose.model("Subtopic", subtopicSchema);
export default Subtopic;
