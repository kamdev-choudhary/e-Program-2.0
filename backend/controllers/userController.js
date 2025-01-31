import User from "../models/user.js";
import cloudinary from "../services/cloudinaryConfig.js";
import { promisify } from "util";
import fs from "fs";

const unlinkAsync = promisify(fs.unlink);

// GET USER DATA
export async function getUserData(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user, message: "User retrieved successfully." });
  } catch (error) {
    next(error);
  }
}

// UPDATE USER DATA
export async function updateUserData(req, res, next) {
  try {
    const { id } = req.params;
    const userDataToUpdate = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, userDataToUpdate, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User updated successfully.", updatedUser });
  } catch (error) {
    next(error);
  }
}

// GET USERS WITH PAGINATION
export async function getUsersWithPagination(req, res, next) {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const users = await User.find({ role }, { password: 0 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const usersCount = await User.countDocuments({ role });

    const adminCount = await User.countDocuments({ role: "admin" });
    const scholarCount = await User.countDocuments({ role: "scholar" });
    const moderatorCount = await User.countDocuments({ role: "moderator" });

    res.status(200).json({
      message: "Users retrieved successfully.",
      users,
      usersCount,
      adminCount,
      scholarCount,
      moderatorCount,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE USER
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
}

// UPDATE PROFILE PICTURE
export async function updateProfilePic(req, res, next) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required." });
    }

    const filePath = req.file.path;

    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: "Profile Pics",
      resource_type: "image",
    });

    // Delete local file after upload
    await unlinkAsync(filePath);

    if (!uploadResponse) {
      return res
        .status(500)
        .json({ message: "Failed to update profile picture." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.photo = uploadResponse.secure_url;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully.",
      profilePicUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    next(error);
  }
}

// UPDATE USER STATUS
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.status = user.status === 1 ? 0 : 1;
    await user.save();

    res.status(200).json({
      message: "User status updated successfully.",
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
}

// GET PROFILE PICTURE
export async function getProfilePic(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile picture retrieved successfully.",
      profilePicUrl: user.photo,
    });
  } catch (error) {
    next(error);
  }
}
