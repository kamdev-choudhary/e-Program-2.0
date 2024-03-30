const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const authRouter = require("./routers/auth-router");
const lectureRouter = require("./routers/lectureRouter");
const questionRouter = require("./routers/questionRoute");
const materialRouter = require("./routers/materialRoute");
const adminRoute = require("./routers/adminRoute");
const examRouter = require("./routers/examRouter");

app.get("/", (req, res) => {
  res.status(200).send("This is Home Page");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoute);
app.use("/api/lectures", lectureRouter);
app.use("/api/questionbank", questionRouter);
app.use("/api/materials", materialRouter);
app.use("/api/exams", examRouter);

app.use("/*", (req, res) => {
  res.send("Backend for DAKSHANA");
});

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening to Port : ${PORT}`);
  });
});
