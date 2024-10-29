const express = require("express");
const router = express(express.Router);
const chatController = require("../controllers/chatController");

router.route("/:id").get(chatController.getAllChats);

router.route("/create").post(chatController.createChat);

router.route("/send").post(chatController.sendChat);

router.route("/messages/:id").get(chatController.getMessages);

module.exports = router;
