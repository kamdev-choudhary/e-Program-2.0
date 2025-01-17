import JEEMainOC from "../models/jeemainoc.js";

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
