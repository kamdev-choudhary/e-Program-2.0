const express = require("express");
const router = express(express.Router);
const materialController = require("../controllers/materialContoller");

router.route("/").get(materialController.getAllBooks);

router.route("/:id").delete(materialController.deleteBook);

router.route("/upload").post(materialController.uploadPdf);

module.exports = router;
