import express, { Router } from "express";
import { body, param, validationResult, query } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("GradeRoutes");

/**
 * POST /api/v1/grades
 * Record grade
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "teacher"),
  [
    body("studentId").isInt(),
    body("courseId").trim(),
    body("grade").trim(),
    body("percentage").isFloat({ min: 0, max: 100 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { studentId, courseId, grade, percentage } = req.body;

    const result = await executeUpdate(
      `INSERT INTO grades (student_id, course_id, grade, percentage) VALUES (?, ?, ?, ?)`,
      [studentId, courseId, grade, percentage]
    );

    logger.info(`Grade recorded for student ${studentId} in course ${courseId}`);

    res.status(201).json({
      success: true,
      message: "Grade recorded successfully",
      gradeId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/grades/student/:studentId
 * Get grades for student
 */
router.get(
  "/student/:studentId",
  authMiddleware,
  [param("studentId").isInt()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const grades = await executeQuery(
      `SELECT id, student_id as studentId, course_id as courseId, grade, percentage,
              created_at as createdAt FROM grades WHERE student_id = ?`,
      [parseInt(req.params.studentId)]
    );

    res.json({
      success: true,
      data: grades,
      count: grades.length,
    });
  })
);

/**
 * GET /api/v1/grades/course/:courseId
 * Get grades for course
 */
router.get(
  "/course/:courseId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const grades = await executeQuery(
      `SELECT id, student_id as studentId, course_id as courseId, grade, percentage,
              created_at as createdAt FROM grades WHERE course_id = ?`,
      [req.params.courseId]
    );

    res.json({
      success: true,
      data: grades,
      count: grades.length,
    });
  })
);

/**
 * PUT /api/v1/grades/:id
 * Update grade
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "teacher"),
  [
    param("id").isInt(),
    body("grade").optional().trim(),
    body("percentage").optional().isFloat({ min: 0, max: 100 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (req.body.grade) {
      updates.push("grade = ?");
      values.push(req.body.grade);
    }
    if (req.body.percentage) {
      updates.push("percentage = ?");
      values.push(req.body.percentage);
    }

    if (updates.length > 0) {
      values.push(parseInt(req.params.id));
      await executeUpdate(
        `UPDATE grades SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }

    logger.info(`Grade updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Grade updated successfully",
    });
  })
);

/**
 * DELETE /api/v1/grades/:id
 * Delete grade
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  [param("id").isInt()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    await executeUpdate("DELETE FROM grades WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Grade deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Grade deleted successfully",
    });
  })
);

export default router;
