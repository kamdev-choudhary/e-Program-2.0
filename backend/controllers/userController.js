import User from "../models/user.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import response from "../utils/responses.js";
import { promisify } from "util";
import fs from "fs";

const unlinkAsync = promisify(fs.unlink);

// GETTING USER DATA

export async function getUserData(req, res, next) {
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
}

// UPDATE USER DATA

export async function updateUserData(req, res, next) {
  const { id } = req.params;
  const userDataToUpdate = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, userDataToUpdate, {
      new: true,
    });
    // updatedUser.isProfileUpdated = true;
    updatedUser.save();
    const users = await User.find({ role: updatedUser.role });
    if (!updatedUser) {
      res.status(200).json("User not Found");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", users, status_code: 3 });
  } catch (error) {
    next(error);
  }
}

// Get user by roles

export async function getUserbyRole(req, res, next) {
  try {
    const { role } = req.params;
    const users = await User.find({ role: role }, { password: 0 });
    res.status(200).json({ status_code: 1, message: "Record Found.", users });
  } catch (error) {
    next(error);
  }
}

// Delete User
export async function deleteUser(req, res, next) {
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
}

// Update Profile Pics
export async function updateProfilePic(req, res, next) {
  try {
    const { id } = req.body;

    // Validate ID
    if (!id) {
      return res
        .status(400)
        .json({ message: "User ID is required", status_code: 0 });
    }

    // Validate file
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File is required", status_code: 0 });
    }

    const filePath = req.file.path;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      folder: "Profile Pics",
      resource_type: "image",
    });

    // Delete local file after upload
    await unlinkAsync(filePath);

    if (response) {
      // Find and update the user
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", status_code: 0 });
      }

      user.photo = response.secure_url;
      await user.save();

      // Return success response
      return res.status(200).json({
        message: "Profile picture updated successfully",
        status_code: 1,
        profilePicUrl: response.secure_url,
      });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to upload image", status_code: 0 });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    next(error); // Pass error to the global error handler
  }
}

// Change user Status
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the status field (0 to 1, or 1 to 0)
    user.status = user.status === 1 ? 0 : 1;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "User status updated successfully",
      status: user.status,
      status_code: 3,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfilePic(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is missing" });
    }
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json({
        profilePicUrl: user.photo,
        message: "Profile Picture found",
        status_code: 1,
      });
    } else {
      return res.status(200).json({ messgae: "User not found" });
    }
  } catch (error) {
    next(error);
  }
}
