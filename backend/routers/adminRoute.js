const express = require("express");
const router = express(express.Router);
const adminController = require("../controllers/adminController");

router.route("/users").get(adminController.users);

module.exports = router;
