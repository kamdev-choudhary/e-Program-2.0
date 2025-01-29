import express from "express";
const router = express.Router();

import {
  getORCRbyYear,
  addNewOROC,
  getJEEAdvancedORCRbyYear,
  addJeeMainMarksVsRank,
  getJeeMainRankVsMarks,
  deleteJeeMainMarksVsRank,
  updateJeeMainMarksVsRank,
  calculateJeeMainRank,
  getJeeMainPredictionInitialData,
  addOrUpdateMarksVsPercentile,
  getMarksVsPercentile,
  getJeeMainMarksVsRankMetadata,
} from "../controllers/AnalysisController.js";

router.route("/jeemain/:year").get(getORCRbyYear);
router.route("/jeeadvanced/:year").get(getJEEAdvancedORCRbyYear);

router.route("/jeemain").post(addNewOROC);

router
  .route("/jeemainrank")
  .post(calculateJeeMainRank)
  .get(getJeeMainPredictionInitialData);

router
  .route("/jeemainmarksvsrank")
  .post(addJeeMainMarksVsRank)
  .get(getJeeMainRankVsMarks);

router
  .route("/jeemain-marks-vs-percetile")
  .post(addOrUpdateMarksVsPercentile)
  .get(getMarksVsPercentile);

router
  .route("/jeemain-marks-vs-percentile/metadata")
  .get(getJeeMainMarksVsRankMetadata);

router
  .route("/jeemainmarksvsrank/:id")
  .delete(deleteJeeMainMarksVsRank)
  .patch(updateJeeMainMarksVsRank);

export default router;
