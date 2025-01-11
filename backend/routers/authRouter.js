import express from "express";
const router = express.Router();

import { login, register, test } from "../controllers/authController.js";

router.route("/login").post(login);
router.route("/register").post(register);

router.route("/", test);

export default router;
