import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("CourseRoutes");

/**
 * POST /api/v1/courses
 * Create course
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "teacher"),
  [
    body("code").trim(),
    body("name").trim(),
    body("description").optional().trim(),
    body("credits").isInt({ min: 1 }),
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

    const { code, name, description, credits } = req.body;

    const result = await executeUpdate(
      `INSERT INTO courses (code, name, description, credits) VALUES (?, ?, ?, ?)`,
      [code, name, description || null, credits]
    );

    logger.info(`Course created: ${code}`);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      courseId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/courses
 * Get all courses
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const courses = await executeQuery(
      `SELECT id, code, name, description, credits, created_at as createdAt 
              FROM courses LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await executeQueryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM courses"
    );

    res.json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        pages: Math.ceil((countResult?.count || 0) / limit),
      },
    });
  })
);

/**
 * GET /api/v1/courses/:id
 * Get course by ID
 */
router.get(
  "/:id",
  authMiddleware,
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

    const course = await executeQueryOne(
      `SELECT id, code, name, description, credits, created_at as createdAt 
              FROM courses WHERE id = ?`,
      [parseInt(req.params.id)]
    );

    if (!course) {
      throw new APIError(404, "Course not found");
    }

    res.json({
      success: true,
      course,
    });
  })
);

/**
 * PUT /api/v1/courses/:id
 * Update course
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "teacher"),
  [
    param("id").isInt(),
    body("name").optional().trim(),
    body("description").optional().trim(),
    body("credits").optional().isInt({ min: 1 }),
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

    if (req.body.name) {
      updates.push("name = ?");
      values.push(req.body.name);
    }
    if (req.body.description) {
      updates.push("description = ?");
      values.push(req.body.description);
    }
    if (req.body.credits) {
      updates.push("credits = ?");
      values.push(req.body.credits);
    }

    if (updates.length > 0) {
      values.push(parseInt(req.params.id));
      await executeUpdate(
        `UPDATE courses SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }

    logger.info(`Course updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Course updated successfully",
    });
  })
);

/**
 * DELETE /api/v1/courses/:id
 * Delete course
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

    await executeUpdate("DELETE FROM courses WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Course deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  })
);

export default router;
