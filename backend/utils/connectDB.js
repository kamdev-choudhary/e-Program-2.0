require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Mongoose Database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
