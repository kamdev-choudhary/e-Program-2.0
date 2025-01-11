import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `🚀 ${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new transports.Console(), // Output logs to the console
    new transports.File({ filename: "app.log" }), // Write logs to a file
  ],
});

export default logger;
