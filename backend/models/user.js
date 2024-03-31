const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: {
    type: String,
    required: true, // corrected typo
  },
  email: {
    type: String,
    required: true, // corrected typo
  },
  mobile: {
    type: String,
    required: true, // corrected typo
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accountType: {
    type: String,
    default: "student",
  },
  password: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, saltRound);
    user.password = hashPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        accountType: this.accountType,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "15d",
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("User", userSchema);
