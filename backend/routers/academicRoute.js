const express = require("express");
const router = express(express.Router);
const academiController = require("../controllers/academicController");

router.route("/").get(academiController.academicData);

router.route("/update").put(academiController.updateAcademicData);

module.exports = router;
