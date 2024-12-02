const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchema = new Schema(
  {
    classLevel: {
      type: String,
      required: true, // Example: "06", "07", "12", "UPSC", "JEE"
      enum: [
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "JEE",
        "NEET",
        "UPSC",
        "SSC",
        "Other",
      ], // Ensure consistency in class/exam levels
    },
    subject: {
      type: String,
      required: true, // Example: "Mathematics", "Physics", "History"
    },
    chapterName: {
      type: String,
      required: true, // Example: "Algebra", "World War II"
    },
    lectureNumber: {
      type: Number,
      required: true, // Lecture sequence in the chapter
    },
    videoId: {
      type: String,
      required: true, // Video identifier (e.g., YouTube video ID)
    },
    facultyName: {
      type: String,
      required: false, // Example: "Dr. John Doe", "Prof. Jane Smith"
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
    examSpecificDetails: {
      type: Map,
      of: String, // Additional key-value details (e.g., "JEE Main Weightage": "High")
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;
