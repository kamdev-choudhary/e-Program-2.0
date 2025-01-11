import express, { Router } from "express";
const router = express(Router);
import {
  viewDoubts,
  saveNewDoubt,
  saveSolution,
  deleteDoubt,
} from "../controllers/doubtController.js";

router.route("/").get(viewDoubts);

router.route("/new").post(saveNewDoubt);

router.route("/:id").post(saveSolution).delete(deleteDoubt);

export default router;
