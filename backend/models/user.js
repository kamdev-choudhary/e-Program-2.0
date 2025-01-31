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
    },
    mobile: {
      type: String,
      required: true,
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
      emum: [0, 1],
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
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
  } catch (err) {
    logger.error(err.message);
    throw new Error("Token generation failed");
  }
};

userSchema.methods.generateRefreshToken = async () => {
  try {
    return jwt.sign(
      {
        _id: this._id.toString(),
        email: this.email,
        role: this.role,
        name: this.name,
        mobile: this.mobile,
      },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: "5d" }
    );
  } catch (error) {
    logger.error(error.message);
    throw new Error("Refresh token generation failed.");
  }
};

export default mongoose.model("User", userSchema);
