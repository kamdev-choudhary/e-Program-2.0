import JEEMainOC from "../models/jeemainoc.js";
import JEEMainMarksVsRank from "../models/jeemainMarksvsRank.js";
import JEEMainMarksVsPercentile from "../models/jeeMainMarksVsPercentile.js";
import JEEMainPercentileVsRank from "../models/jeemainPercentileVsRank.js";
import JEEAdvancedCutoff from "../models/jeeAdvancedCutoff.js";
import JEEAdvancedMarksVsRank from "../models/jeeAdvancedMarksVsRank.js";

const categoryMap = {
  // General
  gen: "general",
  general: "general",

  // EWS
  "general-ews": "ews",
  "gen-ews": "ews",
  ews: "ews",

  // OBC
  obc: "obc",
  "obc-ncl": "obc",
  obcncl: "obc",

  // SC
  sc: "sc",
  SC: "sc",

  // ST
  st: "st",
  "ews-ncl": "ews",

  // PWD
  "general-pwd": "generalPwD",
  "gen-pwd": "generalPwD",
  "obc-pwd": "obcPwD",
  "obc-ncl-pwd": "obcPwD",
  "obcncl-pwd": "obcPwD",
  "sc-pwd": "scPwD",
  "st-pwd": "stPwD",
  "ews-pwd": "ewsPwD",
  "ews-ncl-pwd": "ewsPwD",

  // PREPARATORY
  preparatory: "preparatory",
};

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
      return res.status(200).json({ data });
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
      return res.status(200).json({});
    } else {
      return res.status(200).json({ data });
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
      return res.status(400).json({ message: "validation error" });
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
      insertedRecords,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({});
    } else {
      next(error);
    }
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
      res.status(200).json({ deletedData });
    } else {
      res.status(404).json({ message: "Item not found" });
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
    res.status(200).json({ message: "Data edited Succesfully." });
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
    const uniqueYears = await JEEMainMarksVsPercentile.distinct("year");

    const years = uniqueYears.map((year) => ({ name: year, value: year }));

    // Dataset 2: Year with Sessions
    const yearsWithSessions = await JEEMainMarksVsPercentile.aggregate([
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
    const yearWithDetails = await JEEMainMarksVsPercentile.aggregate([
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

    const withShift = await JEEMainMarksVsPercentile.aggregate([
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
    const fullData = await JEEMainMarksVsPercentile.find();

    // Response
    res.status(200).json({
      uniqueYears: years,
      yearsWithSessions,
      yearWithDetails,
      withShift,
    });
  } catch (error) {
    next(error);
  }
}

// JEE Main Marks Vs Percentile
export async function addOrUpdateMarksVsPercentile(req, res, next) {
  try {
    const { data } = req.body;
    const parsedData = JSON.parse(data);

    // Validate the parsed data
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res.status(400).json({ message: "Invalid Data Provided" });
    }

    let upsertedRecords = [];

    for (const entry of parsedData) {
      const filter = {
        year: entry.year,
        date: entry.date,
        session: entry.session,
        marks: entry.marks,
      };

      const update = {
        $set: {
          shift: entry.shift,
          percentile: entry.percentile,
        },
      };

      const options = { upsert: true, new: true };

      const updatedRecord = await JEEMainMarksVsPercentile.findOneAndUpdate(
        filter,
        update,
        options
      );

      upsertedRecords.push(updatedRecord);
    }

    res.status(201).json({
      upsertedRecords,
      message: `${upsertedRecords.length} records successfully upserted.`,
    });
  } catch (error) {
    next(error);
  }
}

// JEE Main Get Marks vs Percentile
export async function getMarksVsPercentile(req, res, next) {
  try {
    const { marks, session, year, shift, date } = req.query;

    // Build the query object dynamically
    let query = {};
    if (marks) query.marks = marks;
    if (session) query.session = session;
    if (year) query.year = year;
    if (shift) query.shift = shift;
    if (date) query.date = date;

    // Fetch data from the database
    const records = await JEEMainMarksVsPercentile.find(query);

    if (records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json({ data: records });
  } catch (error) {
    next(error);
  }
}

// JEE Main Marks vs Percentile metadat
export async function getJeeMainMarksVsRankMetadata(req, res, next) {
  try {
    const years = await JEEMainMarksVsPercentile.distinct("year");

    const formattedYears = years.map((data) => ({ name: data, value: data }));

    const sessions = await JEEMainMarksVsPercentile.aggregate([
      {
        $group: {
          _id: { year: "$year", session: "$session" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          session: "$_id.session",
        },
      },
    ]);

    const sessionDates = await JEEMainMarksVsPercentile.aggregate([
      {
        $group: {
          _id: { year: "$year", session: "$session", date: "$date" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          session: "$_id.session",
          date: "$_id.date",
        },
      },
    ]);

    const sessionDateShifts = await JEEMainMarksVsPercentile.aggregate([
      {
        $group: {
          _id: {
            year: "$year",
            session: "$session",
            date: "$date",
            shift: "$shift",
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          session: "$_id.session",
          date: "$_id.date",
          shift: "$_id.shift",
        },
      },
    ]);

    return res.status(200).json({
      years: formattedYears,
      sessions,
      sessionDates,
      sessionDateShifts,
    });
  } catch (error) {
    next(error);
  }
}

// JEE Main Percentile vs Rank
export async function addOrUpdatePercentileVsRank(req, res, next) {
  try {
    const { data } = req.body;
    const parsedData = JSON.parse(data);

    // Validate the parsed data
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res.status(400).json({ message: "Invalid Data Provided" });
    }

    let upsertedRecords = [];

    for (const entry of parsedData) {
      const filter = {
        year: entry.year,
        percentile: entry.percentile,
      };

      const update = {
        $set: {
          generalRank: entry.generalRank,
          generalPwdRank: entry.generalPwdRank,

          obcRank: entry.obcRank,
          obcPwdRank: entry.obcPwdRank,

          scRank: entry.scRank,
          scPwdRank: entry.scPwdRank,

          stRank: entry.stRank,
          stPwdRank: entry.stPwdRank,

          ewsRank: entry.ewsRank,
          ewsPwdRank: entry.ewsPwdRank,
        },
      };

      const options = { upsert: true, new: true };

      const updatedRecord = await JEEMainPercentileVsRank.findOneAndUpdate(
        filter,
        update,
        options
      );

      upsertedRecords.push(updatedRecord);
    }

    res.status(201).json({
      upsertedRecords,
      message: `${upsertedRecords.length} records successfully upserted.`,
    });
  } catch (error) {
    next(error);
  }
}

// GET JEE Main Percentile Vs Ranks
export async function getJEEMainPercentileVsRank(req, res, next) {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(404).json({ message: "Year is missing" });
    }
    const data = await JEEMainPercentileVsRank.find({ year });

    return res.status(200).json({ message: "Data Found", data });
  } catch (error) {
    next(error);
  }
}

// Add or Update JEE Advanced Cutoff
export async function addOrUpdateJEEAdvancedCutoff(req, res, next) {
  try {
    const { data } = req.body;
    const parsedData = JSON.parse(data);

    // Find a cutoff entry with the same year and update it, or create a new one if it doesn't exist
    const existingCutoff = await JEEAdvancedCutoff.findOneAndUpdate(
      { year: parsedData.year }, // Search for existing data by year
      parsedData, // Update the data with the new parsedData
      { new: true, upsert: true } // `new: true` returns the updated document, `upsert: true` creates a new document if none exists
    );

    res.status(200).json({ message: "Data saved or updated", existingCutoff });
  } catch (error) {
    next(error);
  }
}

// GET JEE Advanced cutoff
export async function getJEEAdvancedCutoff(req, res, next) {
  try {
    const { year } = req.query;

    if (year) {
      const cutoffData = await JEEAdvancedCutoff.findOne({ year });

      if (cutoffData) {
        res.status(200).json({ data: cutoffData, message: "Data Found" });
      } else {
        res.status(404).json({ message: `No data found for year ${year}` });
      }
    } else {
      const allCutoffData = await JEEAdvancedCutoff.find();
      res.status(200).json({ data: allCutoffData });
    }
  } catch (error) {
    next(error);
  }
}

// Generate JEE Advanced Prediction
export async function generateJeeAdvancedPrediction(req, res, next) {
  try {
    const { students, mode, year, weightage = 1 } = req.body;

    // Fetch cutoff data for the specified year
    const cutoffData = await JEEAdvancedCutoff.findOne({ year });

    if (!cutoffData) {
      return res
        .status(404)
        .json({ message: "Cutoff data not found for the given year" });
    }

    // Parse student data
    const parsedData = JSON.parse(students);

    let summary = {
      physicsQualified: [],
      chemistryQualified: [],
      mathsQualified: [],
      totalQualified: [],
      physicsDidNotQualified: [],
      chemistryDidNotQualified: [],
      mathsDidNotQualified: [],
      totalDidNotQualified: [],
    };

    // Compute predictions
    const predictions = parsedData.map((student) => {
      let categoryKey = student.category.toLowerCase();
      categoryKey = categoryMap[categoryKey] || categoryKey;
      if (["yes", "y"].includes(student.pwd.toLowerCase())) {
        categoryKey += "PwD";
      }

      const categoryCutoff = cutoffData[categoryKey];

      if (!categoryCutoff) {
        return {
          ...student,
          message: `Cutoff data not available for category ${student.category} (PWD: ${student.pwd})`,
          error: "Error",
        };
      }

      // Calculate weighted scores
      const adjustedPhysics = student.physics * weightage;
      const adjustedChemistry = student.chemistry * weightage;
      const adjustedMaths = student.maths * weightage;
      const adjustedTotal = student.total * weightage;

      // Compare with the respective cutoffs
      const isPhysicsQualified = adjustedPhysics >= categoryCutoff.subject;
      isPhysicsQualified
        ? summary.physicsQualified.push(student)
        : summary.physicsDidNotQualified.push(student);
      const isChemistryQualified = adjustedChemistry >= categoryCutoff.subject;
      isChemistryQualified
        ? summary.chemistryQualified.push(student)
        : summary.chemistryDidNotQualified.push(student);
      const isMathsQualified = adjustedMaths >= categoryCutoff.subject;
      isMathsQualified
        ? summary.mathsQualified.push(student)
        : summary.mathsDidNotQualified.push(student);
      const isTotalQualified = adjustedTotal >= categoryCutoff.total;
      isTotalQualified
        ? summary.totalQualified.push(student)
        : summary.totalDidNotQualified.push(student);

      // Final qualification decision (must clear all subjects and total)
      const isQualified =
        isPhysicsQualified &&
        isChemistryQualified &&
        isMathsQualified &&
        isTotalQualified;

      return {
        ...student,
        adjustedScores: {
          physics: adjustedPhysics,
          chemistry: adjustedChemistry,
          maths: adjustedMaths,
          total: adjustedTotal,
        },
        cutoff: {
          subject: categoryCutoff.subject,
          total: categoryCutoff.total,
        },
        isQualified,
        isPhysicsQualified,
        isChemistryQualified,
        isMathsQualified,
        isTotalQualified,
      };
    });

    // Return predictions
    res.status(200).json({
      year,
      mode,
      predictions,
      summary,
    });
  } catch (error) {
    next(error);
  }
}

// Add or Update JEE Advanced Marks Vs Rank
export async function addOrUpdateJEEAdvancedMarksVsRank(req, res, next) {
  try {
    const { data } = req.body;
    const parsedData = JSON.parse(data);

    if (!Array.isArray(parsedData)) {
      throw new Error("Data must be an array of objects.");
    }
    const results = [];

    for (const entry of parsedData) {
      // Find a cutoff entry with the same year and marks, and update it, or create a new one if it doesn't exist
      const existingCutoff = await JEEAdvancedMarksVsRank.findOneAndUpdate(
        { year: entry.year, marks: entry.marks }, // Search for existing data by year and marks
        { $set: entry }, // Use $set to update the fields in the entry
        { new: true, upsert: true } // `new: true` returns the updated document, `upsert: true` creates a new document if none exists
      );

      results.push(existingCutoff);
    }

    res.status(200).json({ message: "Data saved or updated", results });
  } catch (error) {
    next(error);
  }
}

export async function getMetaDataForJEEAdvancedMarksVsRank(req, res, next) {
  try {
    const years = await JEEAdvancedMarksVsRank.distinct("year");
    const formattedYears = years.map((year) => ({ name: year, value: year }));
    res.status(200).json({ years: formattedYears });
  } catch (error) {
    next(error);
  }
}

// GET JEE Advanced Marks VS Rank
export async function getJEEAdvancedMarksVsRank(req, res, next) {
  try {
    const { year } = req.query;

    if (year) {
      const cutoffData = await JEEAdvancedMarksVsRank.find({ year });

      if (cutoffData) {
        res.status(200).json({ data: cutoffData, message: "Data Found" });
      } else {
        res.status(404).json({ message: `No data found for year ${year}` });
      }
    } else {
      const allCutoffData = await JEEAdvancedMarksVsRank.find();
      res.status(200).json({ data: allCutoffData });
    }
  } catch (error) {
    next(error);
  }
}

export async function getJEEAdvancedCutoffYears(req, res, next) {
  try {
    const years = await JEEAdvancedCutoff.distinct("year");
    const formattedYears = years.map((year) => ({ name: year, value: year }));

    res.status(200).json({ message: "Data Found", years: formattedYears });
  } catch (error) {
    next(error);
  }
}

// Predict JEE Advanced Rank
export async function getJeeAdvancedRank(req, res, next) {
  try {
    const { students, year } = req.body;

    if (!students || !year || !Array.isArray(students)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const data = await JEEAdvancedMarksVsRank.find({ year });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: "Data not found for the given year" });
    }

    const results = [];

    for (const student of students) {
      if (!student || !student.category || student.total === undefined) {
        results.push({ error: "Invalid student data", student });
        continue;
      }

      const marks = student.total;
      const categoryRankKey = `${categoryMap[student.category]}Rank`;

      // Find the nearest smaller or exact marks
      let result = data.find((item) => item.marks === marks);

      if (!result) {
        result = data
          .filter((item) => item.marks <= marks) // Ensure selecting nearest lower marks
          .sort((a, b) => b.marks - a.marks)[0];
      }

      if (!result) {
        results.push({ error: "No matching data found", student });
        continue;
      }

      if (categoryMap[student.category] !== "general") {
        if (!result[categoryRankKey] || result[categoryRankKey] === null) {
          result = data
            .filter(
              (item) => item.marks <= marks && item[categoryRankKey] !== null
            )
            .sort((a, b) => b.marks - a.marks)[0];

          if (!result) {
            results.push({
              error: "Valid category rank data not available",
              student,
            });
            continue;
          }
        }
      }

      // Return the ranks
      results.push({
        student,
        airRank: result.generalRank, // Assuming categoryRank is the All India Rank
        catRank:
          student.category !== "General" ? result[categoryRankKey] : null, // Rank based on the student's category
        message: "found",
      });
    }

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}
