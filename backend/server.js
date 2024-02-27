const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

const PORT = 5000;

const authRouter = require("./routers/auth-router");
const lectureRouter = require("./routers/lectureRouter");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("This is Home Page");
});

app.use("/api/auth", authRouter);
app.use("/api/lectures", lectureRouter);

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is liesning at Port : ${PORT}`);
  });
});
