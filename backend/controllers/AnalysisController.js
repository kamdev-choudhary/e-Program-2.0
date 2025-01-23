import JEEMainOC from "../models/jeemainoc.js";
import JEEMainMarksVsRank from "../models/jeemainMarksvsRank.js";

export async function getORCRbyYear(req, res, next) {
  try {
    const { year } = req.params;
    if (!year) {
      return res.status(200).json({ message: "year is missing" });
    }
    const data = await JEEMainOC.find({ year, jee: "main" });
    if (!data) {
      return res.status(200).json({ message: "Record Not Found" });
    } else {
      return res
        .status(200)
        .json({ message: "Record Found", data, status_code: 1 });
    }
  } catch (error) {
    next(error);
  }
}

export async function getJEEAdvancedORCRbyYear(req, res, next) {
  try {
    const { year } = req.params;
    if (!year) {
      return res.status(200).json({ message: "year is missing" });
    }
    const data = await JEEMainOC.find({ year, jee: "advanced" });
    if (!data) {
      return res
        .status(200)
        .json({ message: "Record Not Found", data: [], status_code: 1 });
    } else {
      return res
        .status(200)
        .json({ message: "Record Found", data, status_code: 1 });
    }
  } catch (error) {
    next(error);
  }
}

export async function addNewOROC(req, res, next) {
  try {
    const { data } = req.body;

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
      year: entry.year,
      institute: entry.institute,
      programName: entry.programName,
      quota: entry.quota,
      seatType: entry.seatType,
      gender: entry.gender,
      openingRank: entry.openingRank,
      closingRank: entry.closingRank,
      jee: entry.jee,
    }));

    // Use your database model to perform a batch insert
    const insertedRecords = await JEEMainOC.insertMany(preparedData, {
      ordered: false,
    });

    res.status(201).json({
      message: `${insertedRecords.length} records successfully inserted.`,
      insertedRecords,
      status_code: 1,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Some records were not inserted due to duplicate entries.",
        error: error.message,
      });
    } else {
      next(error);
    }
  }
}

export async function addJeeMainMarksVsRank(req, res, next) {
  try {
    const { data, year, session, dateWithShift } = req.body;

    // Validate and parse the data
    if (!data) {
      return res
        .status(400)
        .json({ message: "Data is required.", status_code: 0 });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid JSON format.", status_code: 0 });
    }

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res
        .status(400)
        .json({ message: "Data must be a non-empty array.", status_code: 0 });
    }

    // Prepare bulk operations for insertion or update
    const bulkOps = parsedData.map((entry) => {
      if (!year || !session || entry.marks === undefined) {
        throw new Error(
          "Each record must contain 'year', 'session', and 'marks'."
        );
      }

      return {
        updateOne: {
          filter: {
            year: year,
            session: session,
            marks: entry.marks,
          },
          update: { $set: { ...entry } },
          upsert: true, // Insert if no matching document is found
        },
      };
    });

    // Perform bulkWrite operation
    const result = await JEEMainMarksVsRank.bulkWrite(bulkOps);

    res.status(201).json({
      message: `${result.nUpserted} records inserted, ${result.nModified} records updated.`,
      status_code: 1,
    });
  } catch (error) {
    next(error);
  }
}

export async function getJeeMainRankVsMarks(req, res, next) {
  try {
    const { ...filters } = req.query;

    const filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => {
        return [key, value];
      })
    );

    const data = await JEEMainMarksVsRank.find(filter);
    if (data.length > 0) {
      return res
        .status(200)
        .json({ data, status_code: 1, message: "Record Found." });
    } else {
      res.status(200).json({ status_code: 0, message: "Record not found" });
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteJeeMainMarksVsRank(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id missing" });
    }
    const deletedData = await JEEMainMarksVsRank.findOneAndDelete({ _id: id });
    if (deletedData) {
      res
        .status(200)
        .json({ message: "Item deleted", status_code: 4, deletedData });
    } else {
      res.status(200).json({ message: "Item not found" });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateJeeMainMarksVsRank(req, res, next) {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;
    const updatedData = await JEEMainMarksVsRank.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: false }
    );
    updatedData.save();
    if (!updatedData) {
      return res.status(200).json("Data not Found");
    }
    res
      .status(200)
      .json({ message: "Data updated successfully", status_code: 3 });
  } catch (error) {
    next(error);
  }
}

export async function calculateJeeMainRank(req, res, next) {
  try {
    const { year, session, mark, scholarData } = req.query;

    if (!year || !session || !mark) {
      return res
        .status(400)
        .json({ message: "Year, session, and mark are required." });
    }

    const parsedMark = parseFloat(mark);
    if (isNaN(parsedMark)) {
      return res.status(400).json({ message: "Invalid mark value." });
    }

    // Find the exact match
    const exactMatch = await JEEMainMarksVsRank.findOne({
      examYear: parseInt(year, 10),
      examSession: session,
      marks: parsedMark,
    });

    // If an exact match is found, return it
    if (exactMatch) {
      return res.status(200).json({ prediction: exactMatch });
    }

    // Find the nearest matches above and below the mark
    const lowerMatch = await JEEMainMarksVsRank.findOne({
      examYear: parseInt(year, 10),
      examSession: session,
      marks: { $lte: parsedMark },
    }).sort({ marks: -1 });

    const upperMatch = await JEEMainMarksVsRank.findOne({
      examYear: parseInt(year, 10),
      examSession: session,
      marks: { $gte: parsedMark },
    }).sort({ marks: 1 });

    // Return the results
    return res.status(200).json({
      prediction: {
        exactMatch: null,
        lowerMatch,
        upperMatch,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getJeeMainPredictionInitialData(req, res, next) {
  try {
    // Dataset 1: Unique Years
    const uniqueYears = await JEEMainMarksVsRank.distinct("year");

    // Dataset 2: Year with Sessions
    const yearsWithSessions = await JEEMainMarksVsRank.aggregate([
      {
        $group: {
          _id: {
            year: "$year",
            session: "$session",
          },
        },
      },
      {
        $project: {
          year: "$_id.year",
          session: "$_id.session",
          _id: 0,
        },
      },
      { $sort: { year: 1, session: 1 } }, // Sort by year and session
    ]);

    // Dataset 3: Year with Date, Session, and Shifts
    const yearWithDetails = await JEEMainMarksVsRank.aggregate([
      {
        $group: {
          _id: {
            year: "$year",
            date: "$date",
            session: "$session",
          },
        },
      },
      {
        $project: {
          year: "$_id.year",
          date: "$_id.date",
          session: "$_id.session",
          _id: 0,
        },
      },
      { $sort: { year: 1, date: 1, session: 1 } }, // Sort by year, date, session, and shift
    ]);

    const withShift = await JEEMainMarksVsRank.aggregate([
      {
        $group: {
          _id: {
            year: "$year",
            date: "$date",
            session: "$session",
            shift: "$shift",
          },
        },
      },
      {
        $project: {
          year: "$_id.year",
          date: "$_id.date",
          session: "$_id.session",
          shift: "$_id.shift",
          _id: 0,
        },
      },
      { $sort: { year: 1, date: 1, session: 1, shift: 1 } }, // Sort by year, date, session, and shift
    ]);

    // Dataset 4: Full Dataset
    const fullData = await JEEMainMarksVsRank.find();

    // Response
    res.status(200).json({
      uniqueYears,
      yearsWithSessions,
      yearWithDetails,
      withShift,
    });
  } catch (error) {
    next(error);
  }
}
