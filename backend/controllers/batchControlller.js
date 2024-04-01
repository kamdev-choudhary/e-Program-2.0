const Batch = require("../models/batch");

module.exports.viewBatch = async (req, res, next) => {
  try {
    const batches = await Batch.find({});
    res.status(200).json({ batches });
  } catch (error) {
    next(error);
  }
};

module.exports.AddBatch = async (req, res, next) => {
  try {
    let newBatch = await new Batch(req.body);
    newBatch.save();
    res.status(200).json({ newBatch });
  } catch (error) {
    next(error);
  }
};
