import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const librarySchema = new Schema({
  bookId: Number,
  title: String,
  author: String,
  subject: String,
  class: String,
  category: String,
  publishingYear: String,
  file: Buffer,
});

const Library = model("Library", librarySchema);

export default Library;
