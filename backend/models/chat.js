// models/Chat.js
import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const chatSchema = new _Schema(
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

export default model("Chat", chatSchema);
