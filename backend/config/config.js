import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb+srv://kamdevchoudhary:mongopassword@cluster0.mrszysb.mongodb.net/eprogram?retryWrites=true&w=majority",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  NODE_ENV: process.env.NODE_ENV || "development",
  API_KEY: process.env.API_KEY || "kd",
  CLOUD_NAME: process.env.CLOUD_NAME || "ddiv6clt7",
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || "987815181534656",
  CLOUD_SECRET: process.env.CLOUD_SECRET || "Q-_JQltrHLmvAmgmqPLoTB5n47c",
  OCR_SPACE_KEY: process.env.OCR_SPACE_KEY || "K88503223788957",
  GMAIL_USER: process.env.GMAIL_USER || "kamdevchoudhary@gmail.com",
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || "igvjaxopgsmixnur",
  WHITELIST: ["http://localhost:5173", "https://e-program.onrender.com"],
  METHOD: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

export default config;
