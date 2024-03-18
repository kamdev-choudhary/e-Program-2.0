const Question = require("../models/questions");

module.exports.viewQuestion = async (req, res, next) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
};
