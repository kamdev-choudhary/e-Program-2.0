import express from "express";
const router = express.Router();

import {
  getORCRbyYear,
  addNewOROC,
  getJEEAdvancedORCRbyYear,
  deleteJeeMainMarksVsRank,
  updateJeeMainMarksVsRank,
  calculateJeeMainRank,
  getJeeMainPredictionInitialData,
  addOrUpdateMarksVsPercentile,
  getMarksVsPercentile,
  getJeeMainMarksVsRankMetadata,
  addOrUpdatePercentileVsRank,
  getJEEMainPercentileVsRank,
} from "../controllers/AnalysisController.js";

router.route("/jeemain/:year").get(getORCRbyYear);
router.route("/jeeadvanced/:year").get(getJEEAdvancedORCRbyYear);

router.route("/jeemain").post(addNewOROC);

router
  .route("/jeemainrank")
  .post(calculateJeeMainRank)
  .get(getJeeMainPredictionInitialData);

router
  .route("/jeemain-marks-vs-percentile")
  .post(addOrUpdateMarksVsPercentile)
  .get(getMarksVsPercentile);

router
  .route("/jeemain-marks-vs-percentile/metadata")
  .get(getJeeMainMarksVsRankMetadata);

router
  .route("/jeemain-percentile-vs-rank")
  .post(addOrUpdatePercentileVsRank)
  .get(getJEEMainPercentileVsRank);

router.route("/jeemainmarksvsrank/:id").patch(updateJeeMainMarksVsRank);

export default router;
