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
    const { status, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    console.log(req.query);

    const doubts = await Doubt.find({ status })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalDoubts = await Doubt.countDocuments({ status });

    if (doubts.length === 0) {
      return res.status(404).json({
        message: "Doubt not found.",
        totalPages: Math.ceil(totalDoubts / limitNumber),
        currentPage: pageNumber,
        totalDoubts,
      });
    }

    res.status(200).json({
      message: "Records found.",
      doubts,
      totalPages: Math.ceil(totalDoubts / limitNumber),
      currentPage: pageNumber,
      totalDoubts,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveNewDoubt(req, res, next) {
  try {
    const { doubtQuestion, description, subject } = req.body;

    if (!doubtQuestion || !description || !subject) {
      return res.status(400).json({
        ...response.notFound("Required data is missing."),
      });
    }

    const doubt = new Doubt(req.body);
    await doubt.save();

    res.status(201).json({
      ...response.success("Doubt posted successfully."),
    });
  } catch (error) {
    next(error);
  }
}

export async function saveSolution(req, res, next) {
  const { id } = req.params;
  const solution = req.body;
  solution.solutionPostedDate = Date.now();

  try {
    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found." });
    }

    doubt.doubtSolutions.push(solution);
    await doubt.save(); // Ensure solution is saved with doubt

    res.status(200).json({ solution });
  } catch (error) {
    next(error);
  }
}

export async function deleteDoubt(req, res, next) {
  try {
    const { id } = req.params;
    const deletedDoubt = await Doubt.findByIdAndDelete(id);
    if (!deletedDoubt) {
      return res.status(404).json({ message: "Doubt not found." });
    }

    res.status(200).json({ message: "Doubt successfully deleted." });
  } catch (error) {
    next(error);
  }
}

export async function getDoubtDetails(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Doubt ID is required.",
        status: 0,
      });
    }

    const doubt = await Doubt.findById(id);

    if (!doubt) {
      return res.status(404).json({
        ...response.notFound("Doubt not found."),
      });
    }

    res.status(200).json({
      ...response.success("Doubt found."),
      doubt,
    });
  } catch (error) {
    next(error);
  }
}
