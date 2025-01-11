import rateLimit from "express-rate-limit";
import { serve, setup } from "swagger-ui-express";

// Routers
import authRouter from "./routers/authRouter.js";
import lectureRouter from "./routers/lectureRouter.js";
import questionRouter from "./routers/questionRoute.js";
import materialRouter from "./routers/materialRoute.js";
import examRouter from "./routers/examRouter.js";
import batchRouter from "./routers/batchRoute.js";
import academicRoute from "./routers/academicRoute.js";
import doubtRoute from "./routers/doubtRoute.js";
import userRoute from "./routers/userRouter.js";
import chatRoute from "./routers/chatRoute.js";
import automationRoute from "./routers/automationRouter.js";

// Rate Limiter for login route
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

// Define routes and middlewares
const routes = (app) => {
  // Health check and root endpoint
  app.get("/", (req, res) =>
    res.status(200).json({ status: "OK", uptime: process.uptime() })
  );

  // Auth route
  app.use("/api/v1/auth", authRouter);

  // API routes with API key check where applicable
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/academic", academicRoute);
  app.use("/api/v1/lectures", lectureRouter);
  app.use("/api/v1/question", questionRouter);
  app.use("/api/v1/materials", materialRouter);
  app.use("/api/v1/exams", examRouter);
  app.use("/api/v1/batch", batchRouter);
  app.use("/api/v1/doubts", doubtRoute);
  app.use("/api/v1/chat", chatRoute);
  app.use("/api/v1/automation", automationRoute);

  // Fallback for unknown routes
  app.use("/*", (req, res) =>
    res.status(404).json({ message: "Route not available" })
  );
};

export default routes;
