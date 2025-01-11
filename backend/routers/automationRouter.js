const express = require("express");
const router = express(express.router);

const automationController = require("../controllers/automationController");

router.route("/jee").post(automationController.downloadCityInformation);

module.exports = router;
