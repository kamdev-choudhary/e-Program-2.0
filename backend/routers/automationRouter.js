import express from "express";
const router = express.Router(); // Correct initialization of the router

import {
  downloadCityInformation,
  downloadAdmitCard,
} from "../controllers/automationController.js";

// Define routes
router.route("/jee/cityinfo").post(downloadCityInformation);
router.route("/jee/admitcard").post(downloadAdmitCard);

export default router;
