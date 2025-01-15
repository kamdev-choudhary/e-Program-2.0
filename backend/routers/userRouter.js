import express, { Router } from "express";
const router = express(Router);
import {
  getUserData,
  deleteUser,
  updateUserData,
  getUserbyRole,
  updateProfilePic,
  updateUserStatus,
} from "../controllers/userController.js";

router.route("/:id").get(getUserData).delete(deleteUser).patch(updateUserData);

router.route("/status/:id").patch(updateUserStatus);

router.route("/role/:role").get(getUserbyRole);

router.route("/profile-pic").post(updateProfilePic);

export default router;
