import express from "express";
const router = express.Router(); // Correct initialization of the router

import {
  downloadCityInformation,
  downloadAdmitCard,
} from "../controllers/automationController.js";

// Define routes
router.route("/jee").post(downloadCityInformation);
router.route("/jee/admitcard").get(downloadAdmitCard);

export default router;
