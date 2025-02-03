import express from "express";
const router = express.Router();

import {
  getClasses,
  addClass,
  editClass,
  removeClass,
  getSubject,
  addSubject,
  editSubject,
  removeSubject,
  getSubSubjects,
  addSubSubject,
  editSubSubject,
  removeSubSubject,
  getTopics,
  addTopic,
  editTopic,
  getSubTopic,
  addSubTopic,
  editSubTopic,
  removeSubTopic,
  getPatterns,
  addPattern,
  deletePattern,
  editPattern,
  getAllMetaData,
} from "../controllers/academicController.js";

router.route("/class").get(getClasses).post(addClass);
router.route("/class/:id").patch(editClass).delete(removeClass);

router.route("/subject").get(getSubject).post(addSubject);
router.route("/subject/:id").patch(editSubject).delete(removeSubject);

router.route("/sub-subject").get(getSubSubjects).post(addSubSubject);
router.route("/sub-subject/:id").patch(editSubSubject).delete(removeSubSubject);

router.route("/topic").get(getTopics).post(addTopic);
router.route("/topic/:id").patch(editTopic).delete(editTopic);

router.route("/sub-topic").get(getSubTopic).post(addSubTopic);
router.route("/sub-topic/:id").patch(editSubTopic).delete(removeSubTopic);

router.route("/question-pattern").get(getPatterns).post(addPattern);

router.route("/question-pattern/:id").delete(deletePattern).patch(editPattern);

router.route("/metadata").get(getAllMetaData);

export default router;

/**
 * @swagger
 * tags:
 *   name: Academic Info
 *   description: Manage academic hierarchy and metadata
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 652a79b54b8ab32b10b476f1
 *         name:
 *           type: string
 *           example: "Class 10"
 *         description:
 *           type: string
 *           example: "Secondary School Final Year"
 *
 *     Subject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         classId:
 *           type: string
 *
 *     SubSubject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         subjectId:
 *           type: string
 *
 *     Topic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         subSubjectId:
 *           type: string
 *
 *     SubTopic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         topicId:
 *           type: string
 *
 *     QuestionPattern:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/academic/class:
 *   get:
 *     summary: Get all classes
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       401:
 *         description: Unauthorized access
 *
 *   post:
 *     summary: Create a new class
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/academic/class/{id}:
 *   patch:
 *     summary: Update a class
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       404:
 *         description: Class not found
 *
 *   delete:
 *     summary: Delete a class
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */

// Similar documentation for subject routes
/**
 * @swagger
 * /api/v1/academic/subject:
 *   get:
 *     summary: Get all subjects
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *
 *   post:
 *     summary: Create a new subject
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created successfully
 */

/**
 * @swagger
 * /api/v1/academic/subject/{id}:
 *   patch:
 *     summary: Update a subject
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject updated
 *
 *   delete:
 *     summary: Delete a subject
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Subject deleted
 */

// Continue similar documentation for sub-subject, topic, sub-topic, and question-pattern routes

/**
 * @swagger
 * /api/v1/academic/metadata:
 *   get:
 *     summary: Get all academic metadata
 *     tags: [Academic Info]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete academic hierarchy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
 *                 subSubjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubSubject'
 *                 topics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Topic'
 *                 subTopics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubTopic'
 *                 patterns:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuestionPattern'
 */
