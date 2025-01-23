import express from "express";
const router = express.Router(); // Correct initialization of the router

import {
  downloadCityInformation,
  downloadAdmitCard,
  generateAdmitCard,
} from "../controllers/automationController.js";

// Define routes
router.route("/jee/cityinfo").post(downloadCityInformation);
router.route("/jee/admitcard").post(downloadAdmitCard);

router.route("/generate/admitcard").post(generateAdmitCard);

export default router;
