import morgan from "morgan";
import logger from "../utils/logger";

const morganHTTP = morgan("combined", {
  stream: { write: (message) => logger.http(message.trim()) },
});

export default morganHTTP;
