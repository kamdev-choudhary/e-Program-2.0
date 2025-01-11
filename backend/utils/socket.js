// socket.js
const { Server } = require("socket.io");
const logger = require("../utils/logger");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    socket.on("exampleEvent", (data) => {
      logger.info("Received exampleEvent with data:", data);
      io.emit("exampleEventResponse", data);
    });
  });

  return io;
};

module.exports = setupSocket;
