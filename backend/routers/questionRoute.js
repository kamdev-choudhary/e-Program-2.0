const express = require("express");
const router = express(express.Router);
const questionController = require("../controllers/questionController");

router.route("/").get(questionController.viewQuestion);

module.exports = router;
