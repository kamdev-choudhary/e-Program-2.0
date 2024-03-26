const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

const PORT = 5000;

const authRouter = require("./routers/auth-router");
const lectureRouter = require("./routers/lectureRouter");
const questionRouter = require("./routers/questionRoute");
const materialRouter = require("./routers/materialRoute");
const adminRoute = require("./routers/adminRoute");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("This is Home Page");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoute);
app.use("/api/lectures", lectureRouter);
app.use("/api/questionbank", questionRouter);
app.use("/api/materials", materialRouter);

app.use("/*", (req, res) => {
  res.send("Backend for DAKSHANA");
});

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening to Port : ${PORT}`);
  });
});
