const express = require("express");
const router = express(express.Router);
const chatController = require("../controllers/chatController");

router.route("/:id", chatController.getAllChats);

module.exports = router;
