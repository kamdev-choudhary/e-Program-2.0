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
} from "../controllers/AnalysisController.js";

router.route("/jeemain/:year").get(getORCRbyYear);
router.route("/jeeadvanced/:year").get(getJEEAdvancedORCRbyYear);

router.route("/jeemain").post(addNewOROC);

router.route("/jeemainrank").get(calculateJeeMainRank);

router
  .route("/jeemainmarksvsrank")
  .post(addJeeMainMarksVsRank)
  .get(getJeeMainRankVsMarks);

router
  .route("/jeemainmarksvsrank/:id")
  .delete(deleteJeeMainMarksVsRank)
  .patch(updateJeeMainMarksVsRank);

export default router;
