const express = require("express");
const router = express(express.Router);
const signUpSchema = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

const authController = require("../controllers/authController");

router.route("/login").post(authController.login);

router.route("/register").post(validate(signUpSchema), authController.register);

module.exports = router;
