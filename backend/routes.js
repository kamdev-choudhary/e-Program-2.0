import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./services/swagger.js";

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
import analysisRoute from "./routers/analysisRoute.js";
import adminRoute from "./routers/adminRoute.js";
import toolsRoute from "./routers/toolsRoute.js";

import verifyToken from "./middlewares/verify-token.js";

const routes = (app) => {
  app.get("/", (req, res) =>
    res.status(200).json({ status: "OK", uptime: process.uptime() })
  );
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", verifyToken, userRoute);
  app.use("/api/v1/admin", verifyToken, adminRoute);
  app.use("/api/v1/academic", verifyToken, academicRoute);
  app.use("/api/v1/lectures", verifyToken, lectureRouter);
  app.use("/api/v1/question", verifyToken, questionRouter);
  app.use("/api/v1/materials", verifyToken, materialRouter);
  app.use("/api/v1/exams", verifyToken, examRouter);
  app.use("/api/v1/batch", verifyToken, batchRouter);
  app.use("/api/v1/doubts", verifyToken, doubtRoute);
  app.use("/api/v1/chat", verifyToken, chatRoute);
  app.use("/api/v1/automation", automationRoute);
  app.use("/api/v1/analysis", analysisRoute);
  app.use("/api/v1/tools", toolsRoute);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/*", (req, res) =>
    res.status(404).json({ message: "Route not available" })
  );
};

export default routes;
