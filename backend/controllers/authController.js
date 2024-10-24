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
  const { name, email, password, mobile, currentClass } = req.body;

  try {
    let userExist = await User.findOne({ email: email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "Email already Registered", status_code: 1 });
    }

    let mobileExist = await User.findOne({ mobile: mobile });
    if (mobileExist) {
      return res
        .status(400)
        .json({ message: "Mobile number already Registered", status_code: 1 });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
    });

    return res.status(200).json({
      message: "Registration Successful",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
      status_code: 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
};

// GETTING USER DATA

module.exports.getUserData = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }, { password: 0 });
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(400).json({ message: "User Not available", status_code: 0 });
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE USER DATA

module.exports.updateUserData = async (req, res, next) => {
  const { id } = req.params;
  const userDataToUpdate = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, userDataToUpdate, {
      new: true,
    });
    updatedUser.isProfileUpdated = true;
    updatedUser.save();
    if (!updatedUser) {
      res.status(200).json("User not Found");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
