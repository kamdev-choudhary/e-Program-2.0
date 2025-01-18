import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const lectureSchema = new Schema(
  {
    className: {
      type: String,
      required: true, // Example: "06", "07", "12", "UPSC", "JEE"
    },
    title: {
      type: String,
    },
    subject: {
      type: String,
    },
    chapter: {
      type: String,
    },
    topic: {
      type: String,
    },
    lectureNumber: {
      type: Number,
    },
    link: {
      type: String,
      required: true,
    },
    linkType: {
      type: String,
    },
    facultyName: {
      type: String,
    },
    description: {
      type: String, // Additional details about the lecture
    },
    duration: {
      type: Number, // Duration of the lecture in minutes
    },
    tags: {
      type: [String], // Keywords for easy searching (e.g., ["Algebra", "Class 12", "Math"])
    },
    isFree: {
      type: Boolean, // Indicates if the lecture is free to access
      default: true,
    },
  },
  { timestamps: true }
);

const Lecture = model("Lecture", lectureSchema);

export default Lecture;
