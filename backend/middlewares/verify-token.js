import pkg from "jsonwebtoken";
const { verify } = pkg;
import config from "../config/config.js";

const jwtSecret = config.JWT_SECRET;

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing." });
  }

  try {
    // Verify the token
    const decoded = verify(token, jwtSecret);

    req.user = { _id: decoded._id, role: decoded.role };
    console.log(decoded);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default verifyToken;
