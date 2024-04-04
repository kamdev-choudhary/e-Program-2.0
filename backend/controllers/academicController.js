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
    const { classes } = req.body;
    const updatedAcademic = await Academic.findOneAndUpdate(
      {},
      { $push: { classes: classes } },
      { new: true }
    );
    console.log("Updated Academic Data:", updatedAcademic);
    res.json(updatedAcademic);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
