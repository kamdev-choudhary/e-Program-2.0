import pkg from "jsonwebtoken";
const { verify } = pkg;
import config from "../config/config.js";
import Session from "../models/session.js";

const jwtSecret = config.JWT_SECRET;

// Middleware to verify the JWT token
const verifyToken = async (req, res, next) => {
  const { authorization, deviceid } = req.headers;

  // Extract token from the Authorization header
  const token = authorization?.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing." });
  }

  try {
    const decoded = verify(token, jwtSecret);

    const session = await Session.findOne({
      userId: decoded._id,
      deviceId: deviceid,
    });

    if (!session) {
      return res.status(401).json({ message: "Session expired." });
    }

    req.user = { _id: decoded._id, role: decoded.role };

    next();
  } catch (error) {
    // Handle JWT token expiration or other errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default verifyToken;
