const express = require("express");
const router = express(express.Router);
const academicController = require("../controllers/academicController");

router.route("/").get(academicController.academicData);

router.route("/update").put(academicController.updateAcademicData);

// router.route("/update/subject").put(academicController)

router.route("/update/topic").put(academicController.updateAcademicTopic);

router.route("/update/subtopic").put(academicController.updateAcademicSubtopic);

// router.route("/update/subtopic").put(academicController);

module.exports = router;
