import multer from "multer";
import path from "path";

// Configure custom storage to preserve file type
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, `${uniqueSuffix}${ext}`); // Preserve the original extension
  },
});

// Configure multer with the custom storage
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Optional: Limit file size to 100 MB
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  },
});

export default upload;
