import mongoose from "mongoose";
const Schema = mongoose.Schema;
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const jwtSecret = config.ACCESS_TOKEN_SECRET;
import logger from "../utils/logger.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensuring email is unique
    },
    mobile: {
      type: String,
      required: true,
      unique: true, // Ensuring mobile is unique
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "scholar",
    },
    photo: { type: String },
    userDetails: {
      type: Schema.Types.ObjectId,
      ref: "UserDetails",
    },
    status: {
      type: Number,
      enum: [0, 1], // Fixed typo
      default: 1,
    },
    apiToken: String,
  },
  {
    timestamps: true,
  }
);

// Generate JWT token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        _id: this._id.toString(),
        email: this.email,
        role: this.role,
        name: this.name,
        mobile: this.mobile,
      },
      jwtSecret, // Using the correct secret variable
      { expiresIn: "5m" }
    );
  } catch (err) {
    logger.error(err.message);
    throw new Error("Token generation failed");
  }
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = async function () {
  try {
    return jwt.sign(
      {
        _id: this._id.toString(),
        email: this.email,
      },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: "5h" }
    );
  } catch (error) {
    logger.error(error.message);
    throw new Error("Refresh token generation failed.");
  }
};

export default mongoose.model("User", userSchema);
