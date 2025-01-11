import Question from "../models/question.js";
import ExamTemplate from "../models/examTemplate.js";

// Questions info Routes
export async function questionInfo(req, res, next) {
  try {
    res.status(200).json({ message: "Questions info route" });
  } catch (error) {
    next(error);
  }
}

// Get Questions with Paginations
export async function getQuestionWithPagination(req, res, next) {
  try {
    // Parse limit and page, provide default values if not specified
    const limit = parseInt(req.query.limit) || 10; // Set a default limit of 10
    const page = parseInt(req.query.page) || 1; // Set a default page of 1

    // Calculate the offset
    const skip = (page - 1) * limit;

    // Fetch questions with pagination
    const questions = await Question.find().skip(skip).limit(limit).exec();

    // Get the total count of questions to calculate total pages
    const totalQuestions = await Question.countDocuments();
    const totalPages = Math.ceil(totalQuestions / limit);

    // Send the paginated response
    res.status(200).json({
      message: "Successful",
      content: questions,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: questions.length,
        totalItems: totalQuestions,
      },
    });
  } catch (error) {
    next(error); // Pass any errors to error-handling middleware
  }
}

// Add Question
export async function saveQuestion(req, res) {
  res.status(200).json("Data Saved Successfully");
}

// Delete Question
export async function deleteQuestion(req, res, next) {}

// update Question
export async function updateQuestion(req, res, next) {
  try {
    const question = await Question.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).json({ Success: "Question Updated Successfully" });
  } catch (error) {
    next(error);
  }
}
