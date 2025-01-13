import express, { Router } from "express";
const router = express(Router);
import {
  viewDoubts,
  saveNewDoubt,
  saveSolution,
  deleteDoubt,
  viewDoubtsByStatus,
  getDoubtDetails,
} from "../controllers/doubtController.js";

router.route("/").get(viewDoubts).post(saveNewDoubt);
router.route("/pagination").post(viewDoubtsByStatus);

router
  .route("/:id")
  .get(getDoubtDetails)
  .post(saveSolution)
  .delete(deleteDoubt);

export default router;
