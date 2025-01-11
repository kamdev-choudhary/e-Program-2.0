import { connect } from "mongoose";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const mongoUrl = config.mongoUrl;

const connectDB = async () => {
  try {
    await connect(mongoUrl);
    logger.info("Connected to Mongoose Database");
  } catch (err) {
    logger.error(err);
  }
};

export default connectDB;
