// models/Message.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "./user.js";

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

export default mongoose.model("Message", messageSchema);
