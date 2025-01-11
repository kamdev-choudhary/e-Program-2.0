import multer, { diskStorage } from "multer";
import { join } from "path";

// Configure storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, "../uploads")); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}_${sanitizedFilename}`);
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "jpg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Please upload an Excel file."));
  }
};

// Set upload limits
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

// Export upload middleware
const upload = multer({ storage, fileFilter, limits });
export default upload;
