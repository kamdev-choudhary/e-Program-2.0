import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const batchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
    },
    stream: {
      type: String,
    },
    session: {
      type: String,
    },
    status: { type: Number, enum: [0, 1] },
    description: { type: String },
    scholars: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture", // Reference to the Lecture model
      },
    ],
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book", // Reference to the Book model
      },
    ],
    testTemplates: [
      {
        type: Schema.Types.ObjectId,
        ref: "TestTemplate",
      },
    ],
    templateImage: {
      title: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

const Batch = model("Batch", batchSchema);

export default Batch;
