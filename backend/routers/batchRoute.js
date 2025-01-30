import express from "express";
const router = express.Router();
import {
  viewBatch,
  getCurrBatch,
  AddBatch,
} from "../controllers/batchControlller.js";
import upload from "../services/multerConfig.js";

// Define routes
router.get("/", viewBatch); // GET all batches
router.post("/", upload.single("photo"), AddBatch); // POST to add a new batch
router.get("/:id", getCurrBatch); // GET a specific batch by ID

export default router;
