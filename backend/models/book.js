import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const bookSchema = new Schema({
  BookId: { type: Number, unique: true },
  title: { type: String, required: true, default: "book" },
  author: { type: String, required: true, default: "author" },
  subject: { type: String, default: "unknown" },
  classLevel: { type: String },
  category: { type: String },
  publishingYear: { type: String },
  fileLink: { type: String },
});

const Book = model("Book", bookSchema);

export default Book;
