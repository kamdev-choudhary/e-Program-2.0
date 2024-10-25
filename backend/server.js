require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const { API_KEY, PORT } = process.env;
const routes = require("./routes");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");

const checkApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Ensure API_KEY and PORT are defined
if (!API_KEY || !PORT) {
  logger.error("Missing required environment variables");
  process.exit(1); // Stop the app if required environment variables are missing
}

// Security middleware
app.use(helmet());

// Other middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Key Middleware
app.use(checkApiKey);

// Routes
routes(app);

// Error middleware
app.use(errorMiddleware);

// Start DB and server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is listening on Port : ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  app.close(() => {
    logger.info("Process terminated");
  });
});

process.on("SIGINT", () => {
  app.close(() => {
    logger.info("Process interrupted");
  });
});
