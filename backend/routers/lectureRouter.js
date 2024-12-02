const express = require("express");
const router = express(express.Router);
const lectureController = require("../controllers/lectureController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(lectureController.viewLectures)
  .post(lectureController.addNewLectureSingle);

router
  .route("/upload")
  .post(upload.single("file"), lectureController.uploadLectureInfo);

router
  .route("/:id")
  .get(lectureController.viewLecturesByClass)
  .delete(lectureController.deleteLecture);

router
  .route("/getlectureswithpagination/:limit/:page")
  .get(lectureController.getLecturesWithPagination);

module.exports = router;
