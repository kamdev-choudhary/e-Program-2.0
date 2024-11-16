const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const { port } = require("./config/config");
const routes = require("./routes");
const logger = require("./utils/logger");
const http = require("http");
const setupSocket = require("./utils/socket");

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(compression());
routes(app);
app.use(errorMiddleware);

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    const io = setupSocket(server);
    server.listen(port, () => {
      logger.info(`Server is listening on port: ${port}`);
    });
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Closing server...`);
  server.close(() => {
    logger.info("Server closed. Exiting process.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
