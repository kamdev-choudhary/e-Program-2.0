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

const port = config.PORT || 5000;

// Resolve __dirname for ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware setup
app.use(helmet());
app.use(cors());
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
      logger.info(`Server is listening on port: ${port}`);
    });
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
