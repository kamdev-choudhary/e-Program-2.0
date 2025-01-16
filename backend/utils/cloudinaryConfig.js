import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUD_NAME, // Your Cloudinary Cloud Name
  api_key: config.CLOUD_API_KEY, // Your Cloudinary API Key
  api_secret: config.CLOUD_SECRET, // Your Cloudinary API Secret
});

export default cloudinary;
