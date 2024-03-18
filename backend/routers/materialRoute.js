const express = require("express");
const router = express(express.Router);
const materialController = require("../controllers/materialContoller");

router.route("/").get(materialController.viewLibrary);

module.exports = router;
