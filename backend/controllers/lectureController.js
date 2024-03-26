const Lecture = require("../models/lectures");

module.exports.viewLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({});
    res.status(200).json({ lectures });
  } catch (error) {
    next(error);
  }
};
