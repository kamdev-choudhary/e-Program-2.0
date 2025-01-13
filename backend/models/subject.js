import mongoose from "mongoose";
import SubSubject from "./subSubject.js";
import Topic from "./subTopic.js";
import Subtopic from "./topic.js";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware to delete related SubSubjects
subjectSchema.pre("findOneAndDelete", async function (next) {
  const subjectId = this.getQuery()._id;
  await SubSubject.deleteMany({ subjectId });
  await Topic.deleteMany({ subjectId });
  await Subtopic.deleteMany({ subjectId });
  next();
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
