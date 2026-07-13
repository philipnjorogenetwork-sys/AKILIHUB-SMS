import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("ParentRoutes");

/**
 * POST /api/v1/parents
 * Create parent record
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    body("personId").isInt(),
    body("studentId").isInt(),
    body("relationship").optional().trim(),
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

    const { personId, studentId, relationship } = req.body;

    const result = await executeUpdate(
      `INSERT INTO parents (person_id, student_id, relationship) VALUES (?, ?, ?)`,
      [personId, studentId, relationship || "Guardian"]
    );

    logger.info(`Parent created for student ${studentId}`);

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      parentId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/parents
 * Get all parents
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const parents = await executeQuery(
      `SELECT id, person_id as personId, student_id as studentId, relationship, 
              created_at as createdAt FROM parents`
    );

    res.json({
      success: true,
      data: parents,
      count: parents.length,
    });
  })
);

/**
 * GET /api/v1/parents/:id
 * Get parent by ID
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

    const parent = await executeQueryOne(
      `SELECT id, person_id as personId, student_id as studentId, relationship,
              created_at as createdAt FROM parents WHERE id = ?`,
      [parseInt(req.params.id)]
    );

    if (!parent) {
      throw new APIError(404, "Parent not found");
    }

    res.json({
      success: true,
      parent,
    });
  })
);

/**
 * GET /api/v1/parents/student/:studentId
 * Get parents of student
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

    const parents = await executeQuery(
      `SELECT id, person_id as personId, student_id as studentId, relationship,
              created_at as createdAt FROM parents WHERE student_id = ?`,
      [parseInt(req.params.studentId)]
    );

    res.json({
      success: true,
      data: parents,
      count: parents.length,
    });
  })
);

/**
 * PUT /api/v1/parents/:id
 * Update parent
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    param("id").isInt(),
    body("relationship").optional().trim(),
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

    if (req.body.relationship) {
      await executeUpdate(
        "UPDATE parents SET relationship = ? WHERE id = ?",
        [req.body.relationship, parseInt(req.params.id)]
      );
    }

    logger.info(`Parent updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Parent updated successfully",
    });
  })
);

/**
 * DELETE /api/v1/parents/:id
 * Delete parent
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

    await executeUpdate("DELETE FROM parents WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Parent deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Parent deleted successfully",
    });
  })
);

export default router;
