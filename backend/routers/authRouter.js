import express from "express";
const router = express.Router();

import {
  login,
  register,
  registerByAdmin,
} from "../controllers/authController.js";

router.route("/login").post(login);
router.route("/register").post(register);

router.route("/register/admin").post(registerByAdmin);

export default router;
