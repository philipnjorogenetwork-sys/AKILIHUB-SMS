import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("ClassroomRoutes");

/**
 * POST /api/v1/classrooms
 * Create classroom
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    body("name").trim(),
    body("gradeLevel").trim(),
    body("capacity").isInt({ min: 1 }),
    body("teacherId").isInt(),
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

    const { name, gradeLevel, capacity, teacherId } = req.body;

    const result = await executeUpdate(
      `INSERT INTO classrooms (name, grade_level, capacity, teacher_id) VALUES (?, ?, ?, ?)`,
      [name, gradeLevel, capacity, teacherId]
    );

    logger.info(`Classroom created: ${name}`);

    res.status(201).json({
      success: true,
      message: "Classroom created successfully",
      classroomId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/classrooms
 * Get all classrooms
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const classrooms = await executeQuery(
      `SELECT id, name, grade_level as gradeLevel, capacity, teacher_id as teacherId, 
              created_at as createdAt FROM classrooms`
    );

    res.json({
      success: true,
      data: classrooms,
      count: classrooms.length,
    });
  })
);

/**
 * GET /api/v1/classrooms/:id
 * Get classroom by ID
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

    const classroom = await executeQueryOne(
      `SELECT id, name, grade_level as gradeLevel, capacity, teacher_id as teacherId,
              created_at as createdAt FROM classrooms WHERE id = ?`,
      [parseInt(req.params.id)]
    );

    if (!classroom) {
      throw new APIError(404, "Classroom not found");
    }

    res.json({
      success: true,
      classroom,
    });
  })
);

/**
 * PUT /api/v1/classrooms/:id
 * Update classroom
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    param("id").isInt(),
    body("name").optional().trim(),
    body("gradeLevel").optional().trim(),
    body("capacity").optional().isInt({ min: 1 }),
    body("teacherId").optional().isInt(),
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
    if (req.body.gradeLevel) {
      updates.push("grade_level = ?");
      values.push(req.body.gradeLevel);
    }
    if (req.body.capacity) {
      updates.push("capacity = ?");
      values.push(req.body.capacity);
    }
    if (req.body.teacherId) {
      updates.push("teacher_id = ?");
      values.push(req.body.teacherId);
    }

    if (updates.length > 0) {
      values.push(parseInt(req.params.id));
      await executeUpdate(
        `UPDATE classrooms SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }

    logger.info(`Classroom updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Classroom updated successfully",
    });
  })
);

/**
 * DELETE /api/v1/classrooms/:id
 * Delete classroom
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

    await executeUpdate("DELETE FROM classrooms WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Classroom deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Classroom deleted successfully",
    });
  })
);

export default router;
