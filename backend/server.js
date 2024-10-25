require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const { api_key, port } = require("./config");
const routes = require("./routes");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");

const checkApiKey = (req, res, next) => {
  const apiKey = req.header("api-key");
  // if (!apiKey || apiKey !== api_key) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  next();
};

if (!api_key || !port) {
  logger.error("Missing required environment variables");
  process.exit(1);
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
app.use(checkApiKey);
routes(app);
app.use(errorMiddleware);

// Start DB and server
connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server is listening on port : ${port}`);
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
