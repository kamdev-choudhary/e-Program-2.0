const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const config = require("../config/config");
const Book = require("../models/Book"); // Assuming the Book model is in this directory
const response = require("../utils/responses");

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudSecret,
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

// Controller function to handle the file upload and save additional book data
module.exports.uploadPdf = [
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
      fs.unlinkSync(filePath);

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

module.exports.getAllBooks = async (req, res, next) => {
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
};

module.exports.deleteBook = async (req, res, next) => {
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
};
