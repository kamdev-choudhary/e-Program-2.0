import express from "express";
const router = express.Router();

import {
  getClasses,
  addClass,
  editClass,
  removeClass,
  getSubject,
  addSubject,
  editSubject,
  removeSubject,
  getSubSubjects,
  addSubSubject,
  editSubSubject,
  removeSubSubject,
  getTopics,
  addTopic,
  editTopic,
  getSubTopic,
  addSubTopic,
  editSubTopic,
  removeSubTopic,
  getPatterns,
  addPattern,
  deletePattern,
  editPattern,
  getAllMetaData,
} from "../controllers/academicController.js";

router.route("/class").get(getClasses).post(addClass);
router.route("/class/:id").patch(editClass).delete(removeClass);

router.route("/subject").get(getSubject).post(addSubject);
router.route("/subject/:id").patch(editSubject).delete(removeSubject);

router.route("/sub-subject").get(getSubSubjects).post(addSubSubject);
router.route("/sub-subject/:id").patch(editSubSubject).delete(removeSubSubject);

router.route("/topic").get(getTopics).post(addTopic);
router.route("/topic/:id").patch(editTopic).delete(editTopic);

router.route("/sub-topic").get(getSubTopic).post(addSubTopic);
router.route("/sub-topic/:id").patch(editSubTopic).delete(removeSubTopic);

router.route("/pattern").get(getPatterns).post(addPattern);

router.route("/pattern/:id").delete(deletePattern).patch(editPattern);

router.route("/metadata").get(getAllMetaData);

export default router;
