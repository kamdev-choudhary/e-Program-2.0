const express = require("express");
const router = express(express.Router);
const userController = require("../controllers/userController");

router.route("/").get(userController.getUserData);

module.exports = router;
