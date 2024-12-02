const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the 'Authorization' header

  if (!token) {
    return res.status(200).json({ message: "You are not a valid User" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(200)
      .json({ status_code: 401, message: "Token is expired." });
  }
};

module.exports = verifyToken;
