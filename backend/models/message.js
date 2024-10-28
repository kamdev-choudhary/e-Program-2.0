// models/Message.js
const mongoose = require("mongoose");
const User = require("./user");
const Chat = require("./chat");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    groupId: { type: Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
