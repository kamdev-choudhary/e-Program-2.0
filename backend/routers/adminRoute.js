import express from "express";
const router = express.Router();

import { getAdminDashboardInfo } from "../controllers/dashboardController.js";

router.route("/dashboard").get(getAdminDashboardInfo);

export default router;
