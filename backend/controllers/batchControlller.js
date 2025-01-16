import Batch from "../models/batch.js";

export async function viewBatch(req, res, next) {
  try {
    const batches = await Batch.find({});
    res.status(200).json({ batches });
  } catch (error) {
    next(error);
  }
}

export async function AddBatch(req, res, next) {
  try {
    const { name, class: className, description } = req.body;

    // Handle file upload if present
    let templateImage = {};
    if (req.file) {
      templateImage = {
        title: req.file.originalname,
        url: `/uploads/${req.file.filename}`, // Path where file is stored locally
      };
    }

    // Create new Batch instance
    const newBatch = new Batch({
      name,
      class: className,
      description,
      templateImage,
    });

    // Save the batch to the database
    const savedBatch = await newBatch.save();

    // Respond with success
    res.status(201).json({
      message: "Batch created successfully",
      batch: savedBatch,
    });
  } catch (error) {
    // Handle errors and pass them to the next middleware
    next(error);
  }
}

export async function getCurrBatch(req, res, next) {
  try {
    let { id } = req.params;
    const batch = await Batch.findById(id).populate({
      path: "examTemplates",
    });

    res.status(200).json({ batch });
  } catch (error) {
    next(error);
  }
}
