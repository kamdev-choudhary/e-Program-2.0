import { v2 as cloudinary } from "cloudinary";
import { unlinkSync } from "fs";
import Book from "../models/book.js"; // Assuming the Book model is in this directory

import config from "../config/config.js";
import upload from "../services/multerConfig.js";

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API_KEY,
  api_secret: config.CLOUD_SECRET,
  secure: true,
});

// Setup multer to temporarily store the file in a local folder

export const uploadPdf = [
  upload.single("pdf"), // Set multer to expect a file with the field name "pdf"
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      // Upload the file to Cloudinary
      const filePath = req.file.path;
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "PDFs",
        resource_type: "auto",
      });

      // Remove the temporary file
      unlinkSync(filePath);

      // Save the book data along with the uploaded file's URL to MongoDB
      const { title, author, subject, classLevel, category, publishingYear } =
        req.body;
      const newBook = new Book({
        title,
        author,
        subject,
        class: classLevel,
        category,
        publishingYear,
        fileLink: result.secure_url,
      });

      await newBook.save();
      const books = await Book.find({});
      // Respond with success message and file URL
      res.status(200).json({
        books,
        book: newBook,
        message: "File Uploaded Successfully and Data Saved.",
      });
    } catch (error) {
      next(error);
    }
  },
];

export async function getAllBooks(req, res, next) {
  try {
    const books = await Book.find({});
    if (books) {
      res.status(200).json({ books });
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findOneAndDelete({ _id: id });
    const books = await Book.find({});
    if (deletedBook) {
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: "Books not Found" });
    }
  } catch (error) {
    next(error);
  }
}
