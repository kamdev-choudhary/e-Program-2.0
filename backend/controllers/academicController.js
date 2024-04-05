const Academic = require("../models/academic");

module.exports.academicData = async (req, res, next) => {
  try {
    const academic = await Academic.find({});
    res.status(200).json({ academic });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAcademicData = async (req, res, next) => {
  try {
    const academic = await Academic.findOne({});
    console.log(academic);
    academic.subjects.push(req.body);
    academic.save();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
