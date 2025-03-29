import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URL:
    "mongodb+srv://kamdevchoudhary:mongopassword@cluster0.mrszysb.mongodb.net/eprogram?retryWrites=true&w=majority",

  // JWT
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "15d",

  SALT_ROUND: process.env.SALT_ROUND || 10,

  NODE_ENV: process.env.NODE_ENV || "development",
  API_KEY: process.env.API_KEY || "kd",
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_SECRET: process.env.CLOUD_SECRET,
  OCR_SPACE_KEY: process.env.OCR_SPACE_KEY,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
};

export default config;
