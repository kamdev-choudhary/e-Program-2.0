import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true }, // Authentication token
    deviceId: { type: String, required: true }, // Unique ID for the device
    platform: { type: String, required: true }, // e.g., "Windows", "iOS"
    browser: { type: String, required: true }, // e.g., "Chrome", "Safari"
    ip: { type: String, required: false }, // User's IP address
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
