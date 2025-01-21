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
    const { data } = req.body;
    const parsedData = JSON.parse(data);
    console.log(parsedData);

    // Validate the parsed data
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty data provided." });
    }
    // Prepare the data for bulk insert
    const preparedData = parsedData.map((entry) => ({
      examYear: entry.examYear,
      examSession: entry.examSession,
      marks: entry.marks,
      percentile: entry.percentile,
      rank: entry.rank,
      generalRank: entry.generalRank,
      obcRank: entry.obcRank,
      scRank: entry.scRank,
      stRank: entry.stRank,
      ewsRank: entry.ewsRank,
      pwdRank: entry.pwdRank,
    }));
    // Use your database model to perform a batch insert
    const insertedRecords = await JEEMainMarksVsRank.insertMany(preparedData, {
      ordered: false,
    });
    res.status(201).json({
      message: `${insertedRecords.length} records successfully inserted.`,
      insertedRecords,
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
    const { year, session } = req.query;
    console.log(year, session);
  } catch (error) {
    next(error);
  }
}
