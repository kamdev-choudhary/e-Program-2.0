import express from "express";
const router = express.Router();
import {
  viewBatch,
  getCurrBatch,
  AddBatch,
} from "../controllers/batchControlller.js";

router.route("/").get(viewBatch);

router.route("/:id").get(getCurrBatch);

router.route("/addnew").post(AddBatch);

export default router;
