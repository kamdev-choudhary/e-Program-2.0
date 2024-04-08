const express = require("express");
const router = express(express.Router);
const academicController = require("../controllers/academicController");

router.route("/").get(academicController.academicData);

router.route("/update").put(academicController.updateAcademicData);

module.exports = router;
