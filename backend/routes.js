const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { api_key } = require("./config/config");
const verifyToken = require("./middlewares/verify-token");

// Routers
const authRouter = require("./routers/authRouter");
const lectureRouter = require("./routers/lectureRouter");
const questionRouter = require("./routers/questionRoute");
const materialRouter = require("./routers/materialRoute");
const examRouter = require("./routers/examRouter");
const batchRouter = require("./routers/batchRoute");
const academicRoute = require("./routers/academicRoute");
const doubtRoute = require("./routers/doubtRoute");
const userRoute = require("./routers/userRouter");
const chatRoute = require("./routers/chatRoute");

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

  // API documentation
  app.use(
    "/api/v1/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
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

  // Fallback for unknown routes
  app.use("/*", (req, res) =>
    res.status(404).json({ message: "Route not available" })
  );
};

module.exports = routes;
