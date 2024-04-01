const express = require("express");
const router = express(express.Router);
const batchController = require("../controllers/batchControlller");

router.route("/").get(batchController.viewBatch);

router.route("/addnew").post(batchController.AddBatch);

module.exports = router;
