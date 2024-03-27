const ExamTemplate = require("../models/examTemplate");
const Question = require("../models/questions");

module.exports.addToTemplate = async (req, res, next) => {
  let { questionId, examTemplateId } = req.body;
  try {
    let currTemplate = await ExamTemplate.findById(examTemplateId);
    console.log(currTemplate);
    let question = await Question.findById(questionId);

    currTemplate.questions.push(question);
    await currTemplate.save();
    res.status(200).json("Successfully Added to source");
  } catch (error) {
    next(error);
  }
};

module.exports.viewExams = async (req, res, next) => {
  try {
    const examTemplates = await ExamTemplate.find({});
    res.status(200).json({ examTemplates });
  } catch (error) {
    next(error);
  }
};

module.exports.createTemplate = async (req, res, nexr) => {
  try {
    const newTemplate = new ExamTemplate(req.body);
    await newTemplate.save();
    res.status(200).json("Template Created Successfully");
  } catch (error) {
    next(error);
  }
};
