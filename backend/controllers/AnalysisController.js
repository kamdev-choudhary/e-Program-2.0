import JEEMainOC from "../models/jeemainoc.js";

export async function getORCRbyYear(req, res, next) {
  try {
    const { year } = req.params;
    if (!year) {
      return res.status(200).json({ message: "year is missing" });
    }
    const data = await JEEMainOC.find({ year });
    if (data) {
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

export async function addNewOROC(req, res, next) {
  try {
    const { data } = req.body;
    console.log(data);
  } catch (error) {
    next(error);
  }
}
