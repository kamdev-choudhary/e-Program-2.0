const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Batch = require("../models/batch");
const response = require("../utils/responses");

// GETTING USER DATA

module.exports.getUserData = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }, { password: 0 }); // Exclude password field
    if (user) {
      res.status(200).json({ user, ...response.success });
    } else {
      res.status(200).json({ message: "User not found", ...response.notFound });
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
    const users = await User.find({ role: updatedUser.role });
    if (!updatedUser) {
      res.status(200).json("User not Found");
    }
    res.status(200).json({ message: "User updated successfully", users });
  } catch (error) {
    next(error);
  }
};

// Get user by roles

module.exports.getUserbyRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role: role });
    res.status(200).json({ status_code: 1, message: "Record Found.", users });
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

// Update Profile Pics
module.exports.updateProfilePic = async (req, res, next) => {
  try {
    const { id, photo } = req.body; // Assuming 'photo' is Base64 or a URL
    if (!id || !photo) {
      return res.status(400).json({ message: "Missing id or photo" });
    }

    // Find the user by their ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile picture
    user.photo = photo; // Assuming 'photo' is the field where profile pic is stored
    await user.save();

    return res
      .status(200)
      .json({
        message: "Profile picture updated successfully",
        user,
        status_code: 1,
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
