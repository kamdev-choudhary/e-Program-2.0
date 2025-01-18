import express, { Router } from "express";
const router = express(Router);
import {
  viewLectures,
  addNewLectureSingle,
  uploadLectureInfo,
  viewLecturesByClass,
  deleteLecture,
  getLecturesWithPagination,
  updateLectureData,
} from "../controllers/lectureController.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.route("/").get(viewLectures).post(addNewLectureSingle);

router.route("/upload").post(uploadLectureInfo);

router
  .route("/:id")
  .get(viewLecturesByClass)
  .delete(deleteLecture)
  .patch(updateLectureData);

router
  .route("/getlectureswithpagination/:limit/:page")
  .get(getLecturesWithPagination);

export default router;
