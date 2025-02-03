import express from "express";
const router = express.Router();

import { getAdminDashboardInfo } from "../controllers/dashboardController.js";

router.route("/dashboard").get(getAdminDashboardInfo);

export default router;

/**
 * @swagger
 * tags:
 *   name: Admin Dashboard
 *   description: Admin dashboard metrics and statistics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           example: 1542
 *         activeSessions:
 *           type: integer
 *           example: 342
 *         totalCourses:
 *           type: integer
 *           example: 45
 *         recentActivities:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "USER_REGISTRATION"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               details:
 *                 type: string
 *                 example: "New user registered: john@example.com"
 *         systemHealth:
 *           type: object
 *           properties:
 *             databaseStatus:
 *               type: string
 *               example: "OK"
 *             serverUptime:
 *               type: string
 *               example: "5 days 3 hours"
 *             activeConnections:
 *               type: integer
 *               example: 128
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard metrics
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Insufficient permissions (requires admin role)
 */
