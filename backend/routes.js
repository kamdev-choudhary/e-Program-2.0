const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const authRouter = require("./routers/authRouter");
const lectureRouter = require("./routers/lectureRouter");
const questionRouter = require("./routers/questionRoute");
const materialRouter = require("./routers/materialRoute");
const adminRoute = require("./routers/adminRoute");
const examRouter = require("./routers/examRouter");
const batchRouter = require("./routers/batchRoute");
const academicRoute = require("./routers/academicRoute");
const doubtRoute = require("./routers/doubtRoute");
const userRoute = require("./routers/userRouter");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth routes
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

const routes = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send("Backend is Running");
  });
  app.use("/api/v1/auth", authRouter, authLimiter);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/admin", adminRoute);
  app.use("/api/v1/lectures", lectureRouter);
  app.use("/api/v1/questionbank", questionRouter);
  app.use("/api/v1/materials", materialRouter);
  app.use("/api/v1/exams", examRouter);
  app.use("/api/v1/batch", batchRouter);
  app.use("/api/v1/academic", academicRoute);
  app.use("/api/v1/doubts", doubtRoute);
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", uptime: process.uptime() });
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/*", (req, res) => {
    res.status(400).json("error from backend");
  });
};

module.exports = routes;
