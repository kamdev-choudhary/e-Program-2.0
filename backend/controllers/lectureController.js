const Lecture = require("../models/lectures");
const response = require("../utils/responses");

module.exports.viewLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({});
    if (lectures) {
      res.status(200).json({ lectures, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.viewLecturesByClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).json({ ...response.validation });
    }
    const lectures = await Lecture.find({ class: id });
    if (lectures) {
      res.status(200).json({ lectures, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
};
