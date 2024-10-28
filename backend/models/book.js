const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

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

bookSchema.plugin(AutoIncrement, { inc_field: "BookId" });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
