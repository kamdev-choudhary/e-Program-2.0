import Doubt from "../models/doubt.js";
import response from "../utils/responses.js";

export async function viewDoubts(req, res, next) {
  try {
    const doubts = await Doubt.find({});
    res.status(200).json({ doubts });
  } catch (error) {
    next(error);
  }
}

export async function viewDoubtsByStatus(req, res, next) {
  try {
    const { status, page = 1, limit = 10 } = req.body;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const doubts = await Doubt.find({ status })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 }); // Sort by created date, newest first

    const totalDoubts = await Doubt.countDocuments({ status });

    res.status(200).json({
      message: "Record Found",
      doubts,
      totalPages: Math.ceil(totalDoubts / limitNumber),
      currentPage: pageNumber,
      totalDoubts,
    });
  } catch (error) {
    next(error);
  }
}

// doubts
export async function saveNewDoubt(req, res, next) {
  try {
    const { doubtQuestion, description, subject } = req.body;
    if (!doubtQuestion || !description || !subject) {
      return res
        .status(200)
        .json({ ...response.notFound("Required Data missing.") });
    }
    const doubt = new Doubt(req.body);
    await doubt.save();
    res.status(200).json({ ...response.success("Doubt Posted Successfully.") });
  } catch (error) {
    next(error);
  }
}

// save doubts
export async function saveSolution(req, res, next) {
  const { id } = req.params;
  const solution = req.body;
  solution.solutionPostedDate = Date.now();
  try {
    const doubt = await Doubt.findById(id);
    doubt.doubtSolutions.push(req.body);
    doubt.save();

    res.status(200).json({ solution });
  } catch (error) {
    next(error);
  }
}

// Delete Doubt
export async function deleteDoubt(req, res) {
  try {
    const { id } = req.params;
    const deletedDoubt = await Doubt.findOneAndDelete({ _id: id });
    res.status(200).json("Succefully Deleted Doubt");
  } catch (error) {
    next(error);
  }
}

// get Doubt Details
export async function getDoubtDetails(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(200)
        .json({ message: "Doubt ID is required", status: 0 });
    }
    const doubt = await Doubt.findById(id);
    if (doubt) {
      return res
        .status(200)
        .json({ ...response.success("Doubt Found."), doubt });
    } else {
      return res.status(200).json({ ...response.notFound("Data not found") });
    }
  } catch (error) {
    next(error);
  }
}
