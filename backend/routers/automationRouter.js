import express from "express";
const router = express.Router(); // Correct initialization of the router

import {
  downloadCityInformation,
  downloadAdmitCard,
  downloadProvisionalAnswerKey,
  getDetailsFromMainQuestionPaper,
  jeeMainResultDownload,
  jeeMainFinalResultDownload,
} from "../controllers/automations/jeemainController.js";

import { generateAdmitCard } from "../controllers/automations/jdst.js";

// Define routes
router.route("/jee/cityinfo").post(downloadCityInformation);
router.route("/jee/admitcard").post(downloadAdmitCard);

router.route("/generate/admitcard").post(generateAdmitCard);

router.route("/jee/provisional-answer-key").post(downloadProvisionalAnswerKey);

router.route("/jee/main-result-01").post(jeeMainResultDownload);
router.route("/jee/main-result-02").get(jeeMainFinalResultDownload);

router
  .route("/jee/data-from-provisional-answer-key")
  .post(getDetailsFromMainQuestionPaper);

export default router;
