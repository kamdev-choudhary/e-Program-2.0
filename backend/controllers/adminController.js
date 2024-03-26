const User = require("../models/user");

module.exports.users = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
