const mongoose = require("mongoose");
const { mongoURI } = require("../config/config");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    logger.info("Connected to Mongoose Database");
  } catch (err) {
    logger.error(err);
  }
};

module.exports = connectDB;
