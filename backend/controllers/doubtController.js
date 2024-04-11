const Doubt = require("../models/doubt");

module.exports.viewDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find({});
    res.status(200).json({ doubts });
  } catch (error) {
    next(error);
  }
};

module.exports.saveNewDoubt = async (req, res, next) => {
  try {
    const doubt = new Doubt(req.body);
    doubt.save();
    res.status(200).json("Successfully posted Doubt");
  } catch (error) {
    next(error);
  }
};
