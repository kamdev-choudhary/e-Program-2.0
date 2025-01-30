import Batch from "../models/batch.js";
import cloudinary from "../services/cloudinaryConfig.js";
import { promisify } from "util";
import fs from "fs";

const unlinkAsync = promisify(fs.unlink);

export async function viewBatch(req, res, next) {
  try {
    const batches = await Batch.find({}).select(
      "name, description class templateImage"
    );
    res.status(200).json({ batches, message: "Batches Found." });
  } catch (error) {
    next(error);
  }
}

export async function AddBatch(req, res, next) {
  try {
    const { name, class: className, description } = req.body;
    const filePath = req.file.path;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "Batch Template",
      resource_type: "image",
    });
    await unlinkAsync(filePath);

    let templateImage = {};
    if (req.file) {
      templateImage = {
        title: req.file.originalname,
        url: uploadResult.secure_url, // Path where file is stored locally
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
      batch: savedBatch,
      message: "Batch Created Successfully.",
    });
  } catch (error) {
    // Handle errors and pass them to the next middleware
    next(error);
  }
}

export async function getCurrBatch(req, res, next) {
  try {
    let { id } = req.params;
    const batch = await Batch.findById(id);
    res.status(200).json({ batch, message: "Batch Detail Found" });
  } catch (error) {
    next(error);
  }
}
