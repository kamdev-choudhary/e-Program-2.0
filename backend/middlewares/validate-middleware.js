const logger = require("../utils/logger");

const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    logger.info(error.message);
    res.status(400).json({ msg: "Validation failed" });
  }
};

module.exports = validate;
