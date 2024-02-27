const Lecture = require("../models/lectures");

module.exports.viewLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({});
    res.status(200).json({ lectures });
  } catch (error) {
    next(error);
  }
};
