import Lecture from "../models/lectures.js";

export async function viewLectures(req, res, next) {
  try {
    const { page = 1, limit = 10, ...filters } = req.query; // Extract pagination and filters
    const pageNumber = parseInt(page, 10); // Convert `page` to integer
    const pageSize = parseInt(limit, 10); // Convert `limit` to integer

    // Process filters for regex-based search or exact match
    const filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => {
        if (["facultyName", "title", "topic"].includes(key)) {
          return [key, { $regex: value, $options: "i" }];
        }
        return [key, value];
      })
    );

    // Get the total count of lectures matching the filter
    const totalCount = await Lecture.countDocuments(filter);

    // Fetch paginated lectures
    const lectures = await Lecture.find(filter)
      .skip((pageNumber - 1) * pageSize) // Skip documents for previous pages
      .limit(pageSize) // Limit to the specified number per page
      .lean(); // Convert Mongoose documents to plain objects for better performance

    // Fetch unique faculties
    const faculties = await Lecture.aggregate([
      { $group: { _id: "$facultyName" } }, // Group by facultyName
      { $project: { _id: 0, facultyName: "$_id" } }, // Transform output to { facultyName: "name" }
      { $sort: { facultyName: 1 } }, // Sort alphabetically
    ]);

    const chapters = await Lecture.aggregate([
      {
        $group: {
          _id: "$chapter", // Group by chapter
          subject: { $first: "$subject" }, // Take the first subject for the chapter
          className: { $first: "$className" },
        },
      },
      {
        $project: {
          _id: 0,
          chapter: "$_id", // Rename _id to chapter
          subject: 1, // Include a single subject
          className: 1,
        },
      },
      { $sort: { chapter: 1 } }, // Sort chapters alphabetically
    ]);

    // Fetch unique subjects
    const subjects = await Lecture.aggregate([
      { $group: { _id: "$subject" } }, // Group by subject
      { $project: { _id: 0, subject: "$_id" } }, // Transform output to { subject: "name" }
      { $sort: { subject: 1 } }, // Sort alphabetically
    ]);

    // Check if lectures are found and return the response
    if (lectures && lectures.length > 0) {
      res.status(200).json({
        lectures,
        totalCount, // Include total number of lectures for pagination
        faculties,
        chapters,
        subjects,
      });
    } else {
      // No lectures found response
      res.status(200).json({ message: "Data Not Found" }); // Assuming `response.notFound` contains generic not-found information
    }
  } catch (error) {
    // Pass the error to the global error handler
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
      deletedLecture: deletedLecture._id,
    });
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
        return res.status(400).json({ message: "validation error" });
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
        insertedRecords,
        message: `${insertedRecords.length} records successfully inserted.`,
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
        message: "Lecture data saved successfully",
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
    res.status(200).json({ page, limit });
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
        message: "Lecture data updated Successfully.",
        updatedLecture,
      });
    }
  } catch (error) {
    next(error);
  }
}
