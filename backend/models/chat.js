// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupName: { type: String },
  admins: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
