import express from "express";
const router = express.Router();
import {
  getAllChats,
  createChat,
  sendChat,
  getMessages,
} from "../controllers/chatController.js";

router.route("/:id").get(getAllChats);

router.route("/create").post(createChat);

router.route("/send").post(sendChat);

router.route("/messages/:id").get(getMessages);

export default router;
