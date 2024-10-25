const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
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

  isAdmin: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    default: "student",
  },

  password: String,

  isProfileUpdated: {
    type: Boolean,
    default: false,
  },

  exams: [
    {
      examId: {
        type: String,
      },
      examStatus: {
        type: String,
        default: "Not Started",
      },
    },
  ],

  currentClass: String,

  batchId: String,

  batchName: String,

  addressLineOne: String,

  addressLineTwo: String,

  city: String,

  district: String,

  state: String,

  pinCode: Number,
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
        role: this.role,
        isAdmin: this.isAdmin,
        name: this.name,
        batchId: this.batchId,
        mobile: this.mobile,
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
