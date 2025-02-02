import express from "express";
const router = express.Router();

import {
  deleteAllSession,
  deleteSession,
  getLoginSession,
  login,
  refreshToken,
  register,
  registerByAdmin,
} from "../controllers/authController.js";

router.route("/login").post(login);
router.route("/register").post(register);

router.route("/register/admin").post(registerByAdmin);

router.route("/session/:id").get(getLoginSession).delete(deleteSession);

router.route("/session/clear-all/:id").delete(deleteAllSession);

router.route("/refresh-token").post(refreshToken);

export default router;
