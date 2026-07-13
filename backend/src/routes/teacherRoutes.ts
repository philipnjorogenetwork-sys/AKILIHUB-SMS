import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("TeacherRoutes");

/**
 * POST /api/v1/teachers
 * Create teacher record
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    body("personId").isInt(),
    body("employeeId").trim(),
    body("qualification").optional().trim(),
    body("department").optional().trim(),
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

    const { personId, employeeId, qualification, department } = req.body;

    const result = await executeUpdate(
      `INSERT INTO teachers (person_id, employee_id, qualification, department) VALUES (?, ?, ?, ?)`,
      [personId, employeeId, qualification || null, department || null]
    );

    logger.info(`Teacher created: ${employeeId}`);

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacherId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/teachers
 * Get all teachers
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const teachers = await executeQuery(
      `SELECT id, person_id as personId, employee_id as employeeId, qualification, 
              department, created_at as createdAt FROM teachers`
    );

    res.json({
      success: true,
      data: teachers,
      count: teachers.length,
    });
  })
);

/**
 * GET /api/v1/teachers/:id
 * Get teacher by ID
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

    const teacher = await executeQueryOne(
      `SELECT id, person_id as personId, employee_id as employeeId, qualification,
              department, created_at as createdAt FROM teachers WHERE id = ?`,
      [parseInt(req.params.id)]
    );

    if (!teacher) {
      throw new APIError(404, "Teacher not found");
    }

    res.json({
      success: true,
      teacher,
    });
  })
);

/**
 * PUT /api/v1/teachers/:id
 * Update teacher
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    param("id").isInt(),
    body("qualification").optional().trim(),
    body("department").optional().trim(),
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

    if (req.body.qualification) {
      updates.push("qualification = ?");
      values.push(req.body.qualification);
    }
    if (req.body.department) {
      updates.push("department = ?");
      values.push(req.body.department);
    }

    if (updates.length > 0) {
      values.push(parseInt(req.params.id));
      await executeUpdate(
        `UPDATE teachers SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }

    logger.info(`Teacher updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Teacher updated successfully",
    });
  })
);

/**
 * DELETE /api/v1/teachers/:id
 * Delete teacher
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

    await executeUpdate("DELETE FROM teachers WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Teacher deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  })
);

export default router;
