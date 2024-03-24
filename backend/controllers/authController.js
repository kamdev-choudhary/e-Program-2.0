const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      return res.status(400).json("Invalid credential");
    }

    const user = await bcrypt.compare(password, userExist.password);

    if (user) {
      res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(500).json({ msg: "invalid email or Password" });
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  let { username, email, password } = req.body;

  let userExist = await User.findOne({ email: email });

  if (userExist) {
    return res.status(400).json("Email already Registered");
  }

  try {
    const newUser = await User.create({
      username,
      email,
      password,
    });
    res.status(200).json({
      msg: "registration Successful",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (err) {
    console.log(err);
    res.status(501).json("internal server Error");
  }
};
