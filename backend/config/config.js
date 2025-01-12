import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUrl:
    process.env.MONGO_URL ||
    "mongodb+srv://kamdevchoudhary:mongopassword@cluster0.mrszysb.mongodb.net/eprogram?retryWrites=true&w=majority",
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  nodeEnv: process.env.NODE_ENV || "development",
  api_key: process.env.API_KEY || "kd",
  cloudName: process.env.CLOUD_NAME || "dgwlqoijt",
  cloudApiKey: process.env.CLOUD_API_KEY || "295749936547257",
  cloudSecret: process.env.CLOUD_SECRET || "LKxfF4nyG0lIb1pgpHvDrfAZWmY",
  ocrSpaceKey: process.env.OCR_SPACE_KEY || "K88503223788957",
  Auth0Domain: process.env.AUTH0_DOMAIN || "",
  Auth0Audience: process.env.AUTH0_AUDIENCE || "",
  gmail: "kamdevchoudhary@gmail.com",
  gmailAppPassword: "igvjaxopgsmixnur",
};

export default config;
