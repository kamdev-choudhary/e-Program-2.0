const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res) => {
  console.log("pahuch gaye bhai");
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      return res.status(400).json("Invalid credential");
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (isPasswordValid) {
      return res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  console.log(req.body);

  try {
    let userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json("Email already Registered");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
    });

    return res.status(200).json({
      msg: "Registration Successful",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
};
