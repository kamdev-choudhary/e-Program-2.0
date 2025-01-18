import Class from "../models/class.js";
import Lecture from "../models/lectures.js";
import Subject from "../models/subject.js";
import response from "../utils/responses.js";

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
    const lectures = await Lecture.find({ className: id });
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
    const { data, linkType = "youtube" } = req.body;

    // Parse the incoming data
    const parsedData = JSON.parse(data);

    // Validate the parsed data
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty data provided." });
    }

    // Prepare the data for bulk insert
    const preparedData = parsedData.map((entry) => ({
      className: entry.className,
      title: entry.title || "",
      subject: entry.subject,
      chapter: entry.chapter || "",
      topic: entry.topic || "",
      link: entry.link,
      lectureNumber: entry.lectureNumber,
      linkType,
    }));

    console.log("Prepared Data:", preparedData);

    // Validate the prepared data
    let isValid = true;
    preparedData.forEach((entry, index) => {
      const validationResult = new Lecture(entry).validateSync();
      if (validationResult) {
        console.error(
          `Validation error for entry at index ${index}:`,
          validationResult.errors
        );
        isValid = false;
      }
    });

    if (!isValid) {
      return res.status(400).json({
        message: "Validation errors found in the provided data.",
      });
    }

    // Insert data into the database
    const insertedRecords = await Lecture.insertMany(preparedData, {
      ordered: false, // Allows inserting valid records while skipping invalid ones
    });

    // Respond with success
    res.status(201).json({
      message: `${insertedRecords.length} records successfully inserted.`,
      insertedRecords,
      status_code: 1,
    });
  } catch (error) {
    console.error("Error uploading lecture info:", error);

    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error.",
        error: error.keyValue,
      });
    }

    // Pass other errors to the error handler middleware
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

export async function updateLectureData(req, res, next) {
  try {
    const { id } = req.params;
    const { lectureDataToUpdate } = req.body;
    const updatedLecture = await Lecture.findByIdAndUpdate(
      id,
      lectureDataToUpdate,
      {
        new: true,
      }
    );
    await updatedLecture.save();
    if (!updatedLecture) {
      return res.status(200).json({ message: "Lecture data not found." });
    } else {
      return res.status(200).json({
        message: "Lecture data is updated successfully.",
        status_code: 1,
        updatedLecture,
      });
    }
  } catch (error) {
    next(error);
  }
}
