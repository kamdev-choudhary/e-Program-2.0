const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Batch = require("../models/batch");

module.exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;
    console.log(id, password);
    const userExist = await User.findOne({ email: id });

    if (!userExist) {
      return res
        .status(200)
        .json({ message: "Email or Password is incorrect", status_code: 0 });
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (isPasswordValid) {
      return res.status(200).json({
        message: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        status_code: 1,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid email or password", status_code: 1 });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  let { name, email, password, mobile, role, method } = req.body;

  if (!password) password = "Password";

  try {
    let userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(200)
        .json({ message: "Email already Registered", status_code: 2 });
    }
    let mobileExist = await User.findOne({ mobile: mobile });
    if (mobileExist) {
      return res
        .status(200)
        .json({ message: "Mobile number already Registered.", status_code: 2 });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
      role,
    });

    if (method === "admin") {
      return res.status(200).json({
        message: "Registration Successful.",
        status_code: 1,
      });
    } else {
      return res.status(200).json({
        message: "Registration Successful",
        token: await newUser.generateToken(),
        userId: newUser._id.toString(),
        status_code: 1,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
};
