const logger = require("../utils/logger"); // Assuming you have a logger utility

const errorMiddleware = (err, req, res, next) => {
  // Set status and message
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  // Log the error details
  logger.error({
    message: err.message,
    stack: err.stack,
    status,
    path: req.originalUrl,
  });

  // Prepare response
  const response = {
    status,
    message,
  };

  // Add extra details if in development mode
  if (process.env.NODE_ENV === "development") {
    response.extraDetails = err.extraDetails || "Error from Backend";
  }

  // Send the response
  return res.status(status).json(response);
};

module.exports = errorMiddleware;
