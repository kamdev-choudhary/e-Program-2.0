const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI:
    process.env.MONGO_URI ||
    "mongodb+srv://kamdevchoudhary:mongopassword@cluster0.mrszysb.mongodb.net/?retryWrites=true&w=majority",
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  nodeEnv: process.env.NODE_ENV || "development",
  api_key: process.env.API_KEY || "kd",
  cloudName: "dgwlqoijt",
  cloudApiKey: "295749936547257",
  cloudSecret: "LKxfF4nyG0lIb1pgpHvDrfAZWmY",
  Auth0Domain: "",
  Auth0Audience: "",
};

module.exports = config;
