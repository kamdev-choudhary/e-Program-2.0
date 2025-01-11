import Class from "../models/class.js";
import Lecture from "../models/lectures.js";
import Subject from "../models/subject.js";
import response from "../utils/responses.js";
import ExcelJS from "exceljs";
import { unlinkSync } from "fs";

export async function viewLectures(req, res, next) {
  try {
    const lectures = await Lecture.find({});
    if (lectures) {
      res.status(200).json({ lectures, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteLecture(req, res, next) {
  try {
    const { id } = req.params;

    const deletedLecture = await Lecture.findOneAndDelete({ _id: id });

    if (!deletedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({
      ...response.deleted,
      deletedLecture: deletedLecture._id,
    });
  } catch (error) {
    next(error);
  }
}

export async function viewLecturesByClass(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      const lectures = await Lecture.find({});
      res.status(200).json({ ...response.success, lectures });
    }
    const lectures = await Lecture.find({ class: id });
    if (lectures) {
      res.status(200).json({ lectures, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function addNewLectureSingle(req, res, next) {
  try {
    const {
      classLevel,
      subject,
      chapterName,
      videoId,
      facultyName,
      description,
      tags,
      lectureNumber,
    } = req.body;

    // Await the subject data
    const subjectData = await Subject.findOne({ id_subject: subject });
    if (!subjectData) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const tagsArray = tags?.split(",") || [];
    const newLecture = new Lecture({
      classLevel,
      subject: subjectData.name,
      videoId,
      tags: tagsArray,
      facultyName,
      description,
      chapterName,
      lectureNumber,
    });

    // Save the lecture
    await newLecture.save();

    res.status(201).json({ ...response.created, newLecture });
  } catch (error) {
    next(error);
  }
}

export async function addNewLecturesMultiple(req, res, next) {
  try {
    res.status(200).json({ ...response.success });
  } catch (error) {
    next(error);
  }
}

export async function uploadLectureInfo(req, res, next) {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path, originalname } = req.file; // File info from multer
    const workbook = new ExcelJS.Workbook();

    // Load the uploaded file
    await workbook.xlsx.readFile(path);

    const worksheet = workbook.worksheets[0]; // Process the first worksheet
    const lectures = [];

    // Extract data row by row
    worksheet.eachRow((row, rowNumber) => {
      // Skip header row (assuming the first row contains headers)
      if (rowNumber === 1) return;

      const lectureData = {
        classLevel: row.getCell(1).value, // Adjust column indices as per your Excel file
        subject: row.getCell(2).value,
        chapterName: row.getCell(3).value,
        lectureNumber: row.getCell(4).value,
        videoId: row.getCell(5).value,
        facultyName: row.getCell(6).value,
        description: row.getCell(7).value || "",
        tags: row.getCell(8).value?.split(",") || [],
      };

      lectures.push(lectureData);
    });

    // Save lecture info to the database
    // Assuming you have a `Lecture` model
    const savedLectures = await Lecture.insertMany(lectures);

    // Delete the uploaded file after processing
    unlinkSync(path);

    res.status(200).json({
      message: "Lecture information uploaded successfully",
      data: savedLectures,
      ...response.success,
    });
  } catch (error) {
    console.error("Error uploading lecture info:", error);
    next(error);
  }
}

// get Lectures with pagination

export async function getLecturesWithPagination(req, res, next) {
  try {
    const { limit, page } = req.params;
    res.status(200).json({ ...response.success, page, limit });
  } catch (error) {
    next(error);
  }
}
