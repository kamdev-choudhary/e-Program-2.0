import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import compression from "compression";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import logger from "./utils/logger.js";
import { createServer } from "http";
import setupSocket from "./utils/socket.js";
import connectDB from "./utils/connectDB.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import config from "./config/config.js";
import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;
const port = config.PORT || 5000;
const isProduction = config.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (isProduction && cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    logger.error(
      `Worker ${worker.process.pid} exited. Starting a new worker...`
    );
    cluster.fork();
  });
} else {
  const app = express();

  app.use(helmet());
  app.options("*", cors());
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://10.0.12.85:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
    })
  );
  app.use(bodyparser.json({ limit: "50mb" }));
  app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use(compression());
  routes(app);
  app.use(errorMiddleware);

  const server = createServer(app);
  const startServer = async () => {
    try {
      await connectDB();
      setupSocket(server);
      server.listen(port, () => {
        logger.info(
          `Worker ${process.pid} is listening on port: ${port} in ${config.NODE_ENV} mode`
        );
      });
    } catch (error) {
      logger.error("Failed to connect to the database", error);
      process.exit(1);
    }
  };
  startServer();
}

process.on("SIGINT", () => {
  logger.info("Server is shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Server is shutting down...");
  process.exit(0);
});
