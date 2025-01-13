import mongoose from "mongoose";

const subSubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    }, // Link to parent subject
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const SubSubject = mongoose.model("SubSubject", subSubjectSchema);
export default SubSubject;
