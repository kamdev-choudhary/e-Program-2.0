const express = require("express");
const router = express(express.Router);
const academicController = require("../controllers/academicController");

router
  .route("/class")
  .get(academicController.getClasses)
  .post(academicController.addClass);
router
  .route("/class/:id")
  .patch(academicController.editClass)
  .delete(academicController.removeClass);

router
  .route("/subject")
  .get(academicController.getSubject)
  .post(academicController.addSubject);
router
  .route("/subject/:id")
  .patch(academicController.editSubject)
  .delete(academicController.removeSubject);

router
  .route("/sub-subject")
  .get(academicController.getSubSubjects)
  .post(academicController.addSubSubject);
router
  .route("/sub-subject/:id")
  .patch(academicController.editSubSubject)
  .delete(academicController.removeSubSubject);

router
  .route("/topic")
  .get(academicController.getTopics)
  .post(academicController.addTopic);
router
  .route("/topic/:id")
  .patch(academicController.editTopic)
  .delete(academicController.editTopic);

router
  .route("/sub-topic")
  .get(academicController.getSubTopic)
  .post(academicController.addSubTopic);
router
  .route("/sub-topic/:id")
  .patch(academicController.editSubTopic)
  .delete(academicController.removeSubTopic);

router
  .route("/pattern")
  .get(academicController.getPatterns)
  .post(academicController.addPattern);

router
  .route("/pattern/:id")
  .delete(academicController.deletePattern)
  .patch(academicController.editPattern);

router.route("/metadata").get(academicController.getAllMetaData);

module.exports = router;
