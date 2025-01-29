import express from "express";
const router = express.Router();

import {
  deleteSession,
  getLoginSesssion,
  login,
  refreshToken,
  register,
  registerByAdmin,
} from "../controllers/authController.js";

router.route("/login").post(login);
router.route("/register").post(register);

router.route("/register/admin").post(registerByAdmin);

router.route("/session/:id").get(getLoginSesssion).delete(deleteSession);

router.route("/refresh-token").post(refreshToken);

export default router;
