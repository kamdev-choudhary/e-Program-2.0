import express from "express";
import {
  getUserData,
  deleteUser,
  updateUserData,
  getUsersWithPagination,
  updateProfilePic,
  updateUserStatus,
  getProfilePic,
} from "../controllers/userController.js";
import upload from "../utils/multerConfig.js";

const router = express.Router(); // Correct instantiation of the Router

// Get users by role route
router.route("/").get(getUsersWithPagination);

// User-specific routes
router
  .route("/:id")
  .get(getUserData) // Get user data by ID
  .delete(deleteUser) // Delete user by ID
  .patch(updateUserData); // Update user data by ID

// Update user status route
router.route("/status/:id").patch(updateUserStatus);

// Profile picture upload route
router.post("/profile-pic", upload.single("photo"), updateProfilePic);
router.route("/profile-pic/:id").get(getProfilePic);

export default router;
