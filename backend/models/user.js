const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const logger = require("../utils/logger");

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
    role: {
      type: String,
      default: "student",
    },
    password: {
      type: String,
      required: true,
    },
    isProfileUpdated: {
      type: Boolean,
      default: false,
    },
    photo: String,
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

// Hash the password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Generate JWT token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        role: this.role,
        name: this.name,
        mobile: this.mobile,
      },
      jwtSecret,
      { expiresIn: "15d" }
    );
  } catch (err) {
    logger.error(err);
    throw new Error("Token generation failed");
  }
};

module.exports = mongoose.model("User", userSchema);
