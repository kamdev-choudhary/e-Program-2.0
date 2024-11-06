const express = require("express");
const router = express(express.Router);

const authController = require("../controllers/authController");

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);

router.route("/", authController.test);

module.exports = router;
