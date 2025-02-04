import express from "express";
const router = express.Router(); // Correct initialization of the router

import {
  downloadCityInformation,
  downloadAdmitCard,
  generateAdmitCard,
  downloadProvisionalAnswerKey,
  getDetailsFromMainQuestionPaper,
} from "../controllers/automationController.js";

// Define routes
router.route("/jee/cityinfo").post(downloadCityInformation);
router.route("/jee/admitcard").post(downloadAdmitCard);

router.route("/generate/admitcard").post(generateAdmitCard);

router.route("/jee/provisional-answer-key").post(downloadProvisionalAnswerKey);

router
  .route("/jee/data-from-provisional-answer-key")
  .post(getDetailsFromMainQuestionPaper);

export default router;
