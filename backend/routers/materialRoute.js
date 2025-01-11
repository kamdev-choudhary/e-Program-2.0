import express, { Router } from "express";
const router = express(Router);
import {
  getAllBooks,
  deleteBook,
  uploadPdf,
} from "../controllers/materialContoller.js";

router.route("/").get(getAllBooks);

router.route("/:id").delete(deleteBook);

router.route("/upload").post(uploadPdf);

export default router;
