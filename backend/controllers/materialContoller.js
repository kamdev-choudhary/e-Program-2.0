const Library = require("../models/library");

module.exports.viewLibrary = async (req, res, next) => {
  try {
    const books = await Library.find({});
    res.status(200).json({ books });
  } catch (error) {
    next(error);
  }
};
