const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Batch = require("../models/batch");

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

// Get user by roles

module.exports.getUserbyRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role: role });
    res.status(200).json({ status_code: 1, users });
  } catch (error) {
    next(error);
  }
};

// Delete User
module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return res
        .status(200)
        .json({ message: "User not found", status_code: 0 });
    }

    const users = await User.find({ role: deletedUser.role });

    res.status(200).json({ users, message: "User deleted", status_code: 1 });
  } catch (error) {
    next(error);
  }
};
