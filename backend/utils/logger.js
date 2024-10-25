const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info", // Log levels: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(), // Output logs to the console
    new transports.File({ filename: "app.log" }), // Write logs to a file
  ],
});

module.exports = logger;
