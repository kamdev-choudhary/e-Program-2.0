const express = require("express");
const router = express(express.Router);
const examController = require("../controllers/examController");

router.route("/addtotemplate").put(examController.addToTemplate);

router.route("/").get(examController.viewExams);

module.exports = router;
