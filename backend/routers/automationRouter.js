import express from "express";
const router = express.Router(); // Correct initialization of the router

import {
  downloadCityInformation,
  downloadAdmitCard,
  indiaPost,
} from "../controllers/automationController.js";

// Define routes
router.route("/jee").post(downloadCityInformation);
router.route("/jee/admitcard").get(downloadAdmitCard);
router.route("/indiapost/:id").get(indiaPost);

export default router;
