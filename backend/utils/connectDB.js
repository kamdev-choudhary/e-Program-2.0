import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import logger from "../utils/logger.js";

const mongoUrl = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await connect(mongoUrl);
    logger.info("Connected to Mongoose Database");
  } catch (err) {
    logger.error(err);
  }
};

export default connectDB;
