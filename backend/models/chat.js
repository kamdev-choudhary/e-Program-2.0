// models/Chat.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String },
    admins: { type: Schema.Types.ObjectId, ref: "User" },
    profile: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
