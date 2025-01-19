import Lecture from "../models/lectures.js";
import response from "../utils/responses.js";

export async function viewLectures(req, res, next) {
  try {
    const { page = 1, limit = 10, ...filters } = req.query; // Extract page, limit, and other filter conditions
    const pageNumber = parseInt(page, 10); // Ensure `page` is an integer
    const pageSize = parseInt(limit, 10); // Ensure `limit` is an integer

    // Build the filter object dynamically from query parameters
    const filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => {
        if (["facultyName", "title", "topic"].includes(key)) {
          return [key, { $regex: value, $options: "i" }];
        }
        return [key, value];
      })
    );

    // Calculate the total count of lectures based on the filter
    const totalCount = await Lecture.countDocuments(filter);

    // Fetch lectures with pagination and filter
    const lectures = await Lecture.find(filter)
      .skip((pageNumber - 1) * pageSize) // Skip documents for previous pages
      .limit(pageSize); // Limit to the specified number per page

    const faculties = await Lecture.aggregate([
      { $group: { _id: "$facultyName" } }, // Group by facultyName
      { $project: { _id: 0, facultyName: "$_id" } }, // Format as { facultyName: "name" }
      { $sort: { facultyName: 1 } }, // Optional: Sort alphabetically
    ]);

    if (lectures && lectures.length > 0) {
      res.status(200).json({
        lectures,
        totalCount, // Include the total number of lectures for client-side pagination
        ...response.success,
        faculties,
      });
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

export async function uploadLectureInfo(req, res, next) {
  try {
    const { data, linkType = "youtube", mode = "single" } = req.body;

    if (mode === "multiple") {
      const parsedData = JSON.parse(data);
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid or empty data provided." });
      }
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
      const insertedRecords = await Lecture.insertMany(preparedData, {
        ordered: false, // Allows inserting valid records while skipping invalid ones
      });
      res.status(201).json({
        message: `${insertedRecords.length} records successfully inserted.`,
        insertedRecords,
        status_code: 1,
      });
    } else {
      const newLecture = new Lecture({
        className: data.className,
        title: data.title || "",
        subject: data.subject,
        chapter: data.chapter || "",
        topic: data.topic || "",
        link: data.link,
        lectureNumber: data.lectureNumber,
        linkType,
      });
      await newLecture.save();
      res.status(200).json({
        newLecture,
        status_code: 1,
        message: "Lecture Saved Successfully",
      });
    }
  } catch (error) {
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
