import Class from "../models/class.js";
import Subject from "../models/subject.js";
import SubSubject from "../models/subSubject.js";
import Topic from "../models/topic.js";
import SubTopic from "../models/subTopic.js";
import { validationResult } from "express-validator";
import response from "../utils/responses.js";
import logger from "../utils/logger.js";
import Pattern from "../models/patterns.js";

// Classes
export async function getClasses(req, res, next) {
  try {
    const classes = await Class.find({});
    if (classes) {
      res.status(200).json({ classes, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function addClass(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        errors: errors.array(),
        message: "Validation error.",
        status_code: 0,
      });
    }
    const { name, value } = req.body;
    const newClass = new Class({ name, value });
    await newClass.save();
    const classes = await Class.find({});
    res.status(201).json({
      classes,
      status_code: 1,
      message: "description",
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function editClass(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        ...response.validation,
      });
    }

    const { name, value, id_class } = req.body;
    const { id } = req.params;
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name, value, id_class },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        ...response.notFound,
      });
    }
    const classes = await Class.find({});
    res.status(200).json({
      classes,
      ...response.edited,
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
}

export async function removeClass(req, res, next) {
  try {
    const { id } = req.params;

    // Attempt to delete the class
    const deletedClass = await Class.findOneAndDelete({ _id: id });

    if (deletedClass) {
      // Fetch remaining classes if deletion is successful
      const classes = await Class.find({});
      return res.status(200).json({
        classes,
        ...response.deleted,
      });
    } else {
      // Class not found
      return res.status(404).json({
        message: "Class not found.",
        status_code: 404,
      });
    }
  } catch (error) {
    // Log the error and return a generic server error response
    logger.error(error.message);
    next(error); // Let the error handler middleware process it
  }
}

// Subject

export async function getSubject(req, res, next) {
  try {
    const subjects = await Subject.find({});
    if (subjects) {
      res.status(200).json({ subjects, ...response.success });
    } else {
      res.status(200).json({ subjects, ...response.notFound });
    }
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
}

export async function addSubject(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        errors: errors.array(),
        message: "Validation error.",
        status_code: 0,
      });
    }
    const { name, description } = req.body;
    const newSubject = new Subject({ name, description });
    await newSubject.save();
    const subjects = await Subject.find({});
    res.status(200).json({
      subjects,
      ...response.created,
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
}

export async function editSubject(req, res, next) {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      res.status(200).json({ message: "Name is Required", status_code: 1 });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    const subjects = await Subject.find({});
    res.status(200).json({ subjects, ...response.edited });
  } catch (error) {
    next(error);
  }
}

export async function removeSubject(req, res, next) {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findOneAndDelete({ _id: id });
    const deletedSubSubject = await SubSubject.deleteMany({
      id_subejct: deletedSubject.id_subject,
    });
    const deletedTopic = await Topic.deleteMany({
      id_subject: deletedSubject.id_subject,
    });
    const deletedSubTopic = await SubTopic.deleteMany({
      id_subject: deletedSubject.id_subject,
    });
    const subjects = await Subject.find({});
    const subSubjects = await SubSubject.find({});
    const topics = await Topic.find({});
    const subTopics = await SubTopic.find({});
    if (deletedSubject) {
      res.status(200).json({
        subjects,
        subSubjects,
        topics,
        subTopics,
        ...response.deleted,
      });
    } else {
      res.status(200).json({ message: "Subject Not Found", status_code: 1 });
    }
  } catch (error) {
    next(error);
  }
}

// Sub Subject
export async function getSubSubjects(req, res, next) {
  try {
    const subSubjects = await SubSubject.find({});
    if (subSubjects) {
      res.status(200).json({ subSubjects, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function addSubSubject(req, res, next) {
  try {
    const { name, description, subject: _id_subject } = req.body;
    console.log(_id_subject);
    if (!name || !_id_subject) {
      return res
        .status(400)
        .json({ message: "Name and subject ID are required.", status_code: 0 });
    }
    const subject = await Subject.findById(_id_subject);
    if (!subject) {
      return res
        .status(404)
        .json({ message: "Subject not found.", status_code: 0 });
    }

    const newSubSubject = new SubSubject({
      name,
      description,
      subjectId: subject._id,
      subjectName: subject.name,
    });

    await newSubSubject.save();
    const subSubjects = await SubSubject.find({});
    res.status(200).json({ subSubjects, ...response.created });
  } catch (error) {
    next(error);
  }
}

export async function editSubSubject(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const editedSubTopic = await SubTopic.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    const subSubjects = await SubSubject.find({});
    res.status(200).json({ subSubjects, ...response.edited });
  } catch (error) {
    next(error);
  }
}

export async function removeSubSubject(req, res, next) {
  try {
    const { id } = req.params;
    const deletedSubSubject = await SubSubject.findOneAndDelete({ _id: id });
    const deletedTopic = await Topic.deleteMany({
      id_sub_subject: deletedSubSubject.id_sub_subject,
    });
    const deletedSubTopic = await SubTopic.deleteMany({
      id_sub_subject: deletedSubSubject.id_sub_subject,
    });
    const subSubjects = await SubSubject.find({});
    if (deletedSubSubject) {
      res.status(200).json({
        subSubjects,
        message: "Sub Subject Deleted Successfully.",
        status_code: 1,
      });
    } else {
      res.status(200).json({
        subSubjects,
        message: "Sub Subject not found.",
        status_code: 1,
      });
    }
  } catch (error) {
    next(error);
  }
}

// Topic
export async function getTopics(req, res, next) {
  try {
    const topics = await Topic.find({});
    if (topics) {
      res.status(200).json({ topics, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function addTopic(req, res, next) {
  try {
    const { name, subjectId, subSubjectId, description } = req.body;
    if (!name || !subjectId || !subSubjectId) {
      return res.status(400).json({
        message: "Name and subject ID and Sub Subject ID are required.",
        status_code: 0,
      });
    }
    const subject = await Subject.findById(subjectId);
    const subSubject = await SubSubject.findById(subSubjectId);
    if (!subSubject || !subject) {
      return res
        .status(404)
        .json({ message: "Subject or Sub Subject not found.", status_code: 0 });
    }

    const newTopic = new Topic({
      name,
      description,
      subjectId,
      subSubjectId,
      subjectName: subject.name,
      subSubjectName: subSubject.name,
    });
    await newTopic.save();
    const topics = await Topic.find({});
    res.status(200).json({ topics, ...response.success });
  } catch (error) {
    next(error);
  }
}

export async function editTopic(req, res, next) {
  try {
  } catch (error) {
    next(error);
  }
}

export async function removeTopic(req, res, next) {
  try {
    const { id } = req.params;
    const deletedTopic = await Topic.findOneAndDelete({ _id: id });
    const deletedSubTopic = await SubTopic.deleteMany({
      id_topic: deletedTopic.id_topic,
    });
    if (!deletedTopic) {
      res.status(200).json({ ...response.notFound });
    } else {
      const topics = await Topic.find({});
      res.status(200).json({ topics, ...response.deleted });
    }
  } catch (error) {
    next(error);
  }
}

// Sub topic
export async function getSubTopic(req, res, next) {
  try {
    const subTopics = await SubTopic.find({});
    if (!subTopics) {
      res.status(200).json({ ...response.notFound });
    } else {
      res.status(200).json({ subTopics, ...response.success });
    }
  } catch (error) {
    next(error);
  }
}

export async function addSubTopic(req, res, next) {
  try {
    const { name, description, subjectId, subSubjectId, topicId } = req.body;
    if ((!name, !description, !subSubjectId, !subjectId, !topicId)) {
      res
        .status(200)
        .json({ message: "Name or Topic is Required", status_code: 0 });
    }
    const topic = await Topic.findById(topicId);
    console.log(topic);
    if (!topic) {
      res.status(200).json({ message: "Topic not found", status_code: 0 });
    }

    const newSubTopic = new SubTopic({
      name,
      description,
      subjectId,
      subSubjectId,
      topicId,
      subjectName: topic.subjectName,
      subSubjectName: topic.subSubjectName,
      topicName: topic.name,
    });
    await newSubTopic.save();
    const subTopics = await SubTopic.find({});
    res.status(200).json({ subTopics, ...response.success });
  } catch (error) {
    next(error);
  }
}

export async function editSubTopic(req, res, next) {
  try {
  } catch (error) {
    next(error);
  }
}

export async function removeSubTopic(req, res, next) {
  try {
    const { id } = req.params;
    const deleteSubTopic = await SubTopic.findOneAndDelete({ _id: id });
    if (!deleteSubTopic) {
      res.status(200).json({ ...response.notFound });
    } else {
      const subTopics = await SubTopic.find({});
      res.status(200).json({ subTopics, ...response.deleted });
    }
  } catch (error) {
    next(error);
  }
}

export async function getPatterns(req, res, next) {
  try {
    const patterns = await Pattern.find({});
    if (patterns) {
      res.status(200).json({ patterns, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function addPattern(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(200).json({ ...response.validation });
    }
    const newPattern = new Pattern({
      name,
      description,
    });
    await newPattern.save();
    const patterns = await Pattern.find({});
    if (patterns) {
      res.status(200).json({ patterns, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function deletePattern(req, res, next) {
  try {
    const { id } = req.params;
    const deletedPattern = await Pattern.findOneAndDelete({ _id: id });
    if (!deletedPattern) {
      res.status(200).json({ ...response.notFound });
    }
    const patterns = await Pattern.find({});
    if (patterns) {
      res.status(200).json({ patterns, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function editPattern(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedPattern = await Pattern.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );
    const patterns = await Pattern.find({});
    if (patterns) {
      res.status(200).json({ patterns, ...response.success });
    } else {
      res.status(200).json({ ...response.notFound });
    }
  } catch (error) {
    next(error);
  }
}

export async function getAllMetaData(req, res, next) {
  try {
    const classes = await Class.find({});
    const subjects = await Subject.find({});
    const subSubjects = await SubSubject.find({});
    const topics = await Topic.find({});
    const subTopics = await SubTopic.find({});
    const patterns = await Pattern.find({});

    res.status(200).json({
      classes,
      subjects,
      subSubjects,
      topics,
      subTopics,
      patterns,
      ...response.success,
    });
  } catch (error) {
    next(error);
  }
}
