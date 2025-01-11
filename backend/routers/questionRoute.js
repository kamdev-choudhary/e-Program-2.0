import express, { Router } from "express";
const router = express(Router);
import {
  getQuestionWithPagination,
  saveQuestion,
  updateQuestion,
  deleteQuestion,
  questionInfo,
} from "../controllers/questionController.js";

router
  .route("/")
  .get(getQuestionWithPagination)
  .post(saveQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

router.route("/info").get(questionInfo);

export default router;
