import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import logger from "./utils/logger.js";
import { createServer } from "http";
import setupSocket from "./services/socket.js";
import connectDB from "./services/connectDB.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import config from "./config/config.js";
import cluster from "cluster";
import os from "os";
import corsOptions from "./config/cors.js";

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
    logger.error(`Worker ${worker.process.pid} exited. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  // Security middleware
  app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP to avoid blocking frontend scripts
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
  );

  // Middleware
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(compression());

  // Static file serving
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Routes
  routes(app);

  // Error handling middleware
  app.use(errorMiddleware);

  const server = createServer(app);

  const startServer = async () => {
    try {
      await connectDB();
      setupSocket(server);
      server.listen(port, () => {
        logger.info(
          `Worker ${process.pid} listening on port ${port} in ${config.NODE_ENV} mode`
        );
      });
    } catch (error) {
      logger.error("Failed to connect to the database:", error);
      process.exit(1);
    }
  };

  startServer();

  // Graceful Shutdown
  const shutdown = async () => {
    logger.info("Shutting down server...");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
