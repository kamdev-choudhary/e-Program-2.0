import express from "express";
const router = express.Router();

import {
  deleteSession,
  getLoginSesssion,
  login,
  register,
  registerByAdmin,
} from "../controllers/authController.js";

router.route("/login").post(login);
router.route("/register").post(register);

router.route("/register/admin").post(registerByAdmin);

router.route("/session/:id").get(getLoginSesssion).delete(deleteSession);

export default router;
