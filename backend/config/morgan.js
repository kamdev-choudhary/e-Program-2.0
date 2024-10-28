const morgan = require("morgan");
const logger = require("../utils/logger");

const morganHTTP = morgan("combined", {
  stream: { write: (message) => logger.http(message.trim()) },
});

export default morganHTTP;
