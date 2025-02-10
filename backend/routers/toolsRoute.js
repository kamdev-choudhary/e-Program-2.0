import express from "express";
const router = express.Router();

import { compressPDFs } from "../controllers/toolsController.js";
import upload from "../services/multerConfig.js";

router.route("/pdf/compress").post(upload.single("pdf"), compressPDFs);

export default router;
