import express from "express";
const router = express.Router();

import {
  getORCRbyYear,
  addNewOROC,
} from "../controllers/AnalysisController.js";

router.route("/jeemain/:year").get(getORCRbyYear);

router.route("/jeemain").post(addNewOROC);

export default router;
