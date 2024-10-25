const rateLimit = require("express-rate-limit");

const authRouter = require("./routers/authRouter");
const lectureRouter = require("./routers/lectureRouter");
const questionRouter = require("./routers/questionRoute");
const materialRouter = require("./routers/materialRoute");
const adminRoute = require("./routers/adminRoute");
const examRouter = require("./routers/examRouter");
const batchRouter = require("./routers/batchRoute");
const academicRoute = require("./routers/academicRoute");
const doubtRoute = require("./routers/doubtRoute");

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
  app.use("/api/auth", authRouter, authLimiter);
  app.use("/api/admin", adminRoute);
  app.use("/api/lectures", lectureRouter);
  app.use("/api/questionbank", questionRouter);
  app.use("/api/materials", materialRouter);
  app.use("/api/exams", examRouter);
  app.use("/api/batch", batchRouter);
  app.use("/api/academic", academicRoute);
  app.use("/api/doubts", doubtRoute);
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", uptime: process.uptime() });
  });
  app.use("/*", (req, res) => {
    res.status(400).json("error from backend");
  });
};

module.exports = routes;
