const Question = require("../models/questions");

module.exports.viewQuestion = async (req, res, next) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
};

module.exports.saveQuestion = async (req, res) => {
  const newQuestion = new Question(req.body);
  let subject = req.body.subject;
  let preQuestionId = (subject) => {
    let qprefix;
    switch (subject.toLowerCase()) {
      case "physics":
        qprefix = 1000000;
        break;
      case "chemistry":
        qprefix = 2000000;
        break;
      case "mathematics":
        qprefix = 3000000;
        break;
      case "biology":
        qprefix = 4000000;
        break;
      default:
        qprefix = 50000000;
        break;
    }
    return qprefix;
  };

  try {
    let maxQuestionId = await Question.aggregate([
      { $match: { subject: subject } },
      { $group: { _id: null, maxQuestionID: { $max: "$questionId" } } },
    ]);

    if (maxQuestionId.length > 0 && maxQuestionId[0].maxQuestionID !== null) {
      newQuestion.questionId = +maxQuestionId[0].maxQuestionID + 1;
    } else {
      newQuestion.questionId = +preQuestionId(subject) + 1;
    }
  } catch (error) {
    console.error("Error occurred while finding max question ID:", error);
  }
  await newQuestion.save();
  res.status(200).json("Data Saved Successfully");
};
