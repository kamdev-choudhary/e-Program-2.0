require("dotenv").config();
const mongoose = require("mongoose");
const { mongoURI } = require("../config/config");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongoose Database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
