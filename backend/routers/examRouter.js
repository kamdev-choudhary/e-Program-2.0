import express, { Router } from "express";
const router = express(Router);
import {
  addToTemplate,
  createTemplate,
  viewExams,
  viewExamTemplate,
  addToBatch,
} from "../controllers/examController.js";

router.route("/addtotemplate").put(addToTemplate);
router.route("/createtemplate").put(createTemplate);
router.route("/").get(viewExams);
router.route("/templates/:id").get(viewExamTemplate);

router.route("/addtobatch").post(addToBatch);

export default router;
