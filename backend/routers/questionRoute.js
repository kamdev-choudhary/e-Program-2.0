const express = require("express");
const router = express(express.Router);
const questionController = require("../controllers/questionController");

router
  .route("/")
  .get(questionController.getQuestionWithPagination)
  .post(questionController.saveQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

router.route("/info").get(questionController.questionInfo);

module.exports = router;
