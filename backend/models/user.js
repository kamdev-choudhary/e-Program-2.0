import mongoose from "mongoose";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    mobile: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false }, // Do not return password by default
    role: {
      type: String,
      default: "scholar",
      enum: ["admin", "scholar", "moderator", "teacher"],
    },
    photo: { type: String, default: "" },
    status: { type: Number, enum: [0, 1], default: 1, index: true }, // 1: Active, 0: Disabled

    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false }, // Lock account after too many failed attempts
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // 🏡 Profile Information
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    category: { type: String },
    pwd: { type: String, default: "No", enum: ["Yes", "No"] },

    // Address
    addressLineOne: { type: String },
    addressLineTwo: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: Number },

    bio: { type: String, trim: true },
    preferences: {
      theme: { type: String, default: "light" }, // Example: dark mode preference
      language: { type: String, default: "en" },
    },

    notifications: [
      {
        message: { type: String },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },

    // 🔗 Social & Referral System
    socialAccounts: {
      google: { type: String },
      facebook: { type: String },
      github: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, mobile: 1, status: 1 });

// 🔑 Generate Access Token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      role: this.role,
      name: this.name,
      mobile: this.mobile,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );
};

// 🔑 Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id.toString(), email: this.email },
    config.REFRESH_TOKEN_SECRET
  );
};

// 🔑 Hash Password Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    if (!this.password) {
      throw new Error("Password is missing for this user.");
    }
    return bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    logger.error("Error in comparing the password:", error);
    throw new Error("Error in comparing password");
  }
};

// 🔐 Lock account after too many failed attempts
userSchema.methods.incrementFailedLogins = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.isLocked = true;
  }
  await this.save();
};

// 🔓 Unlock user account
userSchema.methods.unlockAccount = async function () {
  this.failedLoginAttempts = 0;
  this.isLocked = false;
  await this.save();
};

export default mongoose.model("User", userSchema);
