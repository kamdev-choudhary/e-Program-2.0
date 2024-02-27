const express = require("express");
const router = express(express.Router);
const lectureController = require("../controllers/lectureController");

router.route("/").get(lectureController.viewLectures);

module.exports = router;
