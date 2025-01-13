import mongoose from "mongoose";
import Topic from "./subTopic.js";
import Subtopic from "./topic.js";

const subSubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    }, // Link to parent subject
    subjectName: String,
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware to delete related SubSubjects
subSubjectSchema.pre("findOneAndDelete", async function (next) {
  const subSubjectId = this.getQuery()._id;
  await Topic.deleteMany({ subSubjectId });
  await Subtopic.deleteMany({ subSubjectId });
  next();
});

const SubSubject = mongoose.model("SubSubject", subSubjectSchema);
export default SubSubject;
