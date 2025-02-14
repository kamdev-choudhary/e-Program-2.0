import express from "express";
const router = express.Router();

import { downloadMarksheet } from "../controllers/templateController.js";

router.route("/marksheet").get(downloadMarksheet);

export default router;
