// models/Message.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "./user.js";

// Message Schema
const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    type: {
      type: String,
      enum: [
        "text",
        "image",
        "video",
        "audio",
        "document",
        "contact",
        "location",
        "sticker",
      ],
      required: true,
    },
    content: { type: String }, // message text or file URL
    repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
