import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { unlinkSync } from "fs";
import Book from "../models/book.js"; // Assuming the Book model is in this directory
import response from "../utils/responses.js";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUD_NAME;
const cloudApiKey = process.env.CLOUD_API_KEY;
const cloudSecret = process.env.CLOUD_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudSecret,
  secure: true,
});

// Setup multer to temporarily store the file in a local folder
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed."
        ),
        false
      );
    }
  },
});

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
        message: "File uploaded and book data saved successfully",
        book: newBook,
        status_code: 1,
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
      res.status(200).json({ books, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
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
      res.status(200).json({ books, ...response.deleted });
    } else {
      res.status(200).json({ message: "Book not found.", status_code: 0 });
    }
  } catch (error) {
    next(error);
  }
}
