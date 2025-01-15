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
  CLOUD_NAME: process.env.CLOUD_NAME || "dgwlqoijt",
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || "295749936547257",
  CLOUD_SECRET: process.env.CLOUD_SECRET || "LKxfF4nyG0lIb1pgpHvDrfAZWmY",
  OCR_SPACE_KEY: process.env.OCR_SPACE_KEY || "K88503223788957",
  GMAIL_USER: process.env.GMAIL_USER || "kamdevchoudhary@gmail.com",
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || "igvjaxopgsmixnur",
};

export default config;
