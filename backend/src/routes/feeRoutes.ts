import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("FeeRoutes");

/**
 * POST /api/v1/fees
 * Record fee payment
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "finance"),
  [
    body("studentId").isInt(),
    body("amount").isFloat({ min: 0 }),
    body("type").trim(),
    body("month").optional().trim(),
    body("remarks").optional().trim(),
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

    const { studentId, amount, type, month, remarks } = req.body;

    const result = await executeUpdate(
      `INSERT INTO fees (student_id, amount, type, month, remarks) VALUES (?, ?, ?, ?, ?)`,
      [studentId, amount, type, month || null, remarks || null]
    );

    logger.info(`Fee recorded: student ${studentId}, amount ${amount}`);

    res.status(201).json({
      success: true,
      message: "Fee recorded successfully",
      feeId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/fees/student/:studentId
 * Get fees for student
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

    const fees = await executeQuery(
      `SELECT id, student_id as studentId, amount, type, month, remarks, 
              created_at as createdAt FROM fees WHERE student_id = ?`,
      [parseInt(req.params.studentId)]
    );

    res.json({
      success: true,
      data: fees,
      count: fees.length,
    });
  })
);

/**
 * GET /api/v1/fees/stats
 * Get fee statistics
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("Admin", "finance"),
  asyncHandler(async (req, res) => {
    const stats = await executeQueryOne<{
      totalFees: number;
      totalCollected: number;
      pendingAmount: number;
    }>(
      `SELECT 
        COUNT(*) as totalFees,
        SUM(amount) as totalCollected,
        (SELECT SUM(fee_balance) FROM students) as pendingAmount
       FROM fees`
    );

    res.json({
      success: true,
      stats,
    });
  })
);

/**
 * PUT /api/v1/fees/:id
 * Update fee record
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "finance"),
  [
    param("id").isInt(),
    body("amount").optional().isFloat({ min: 0 }),
    body("type").optional().trim(),
    body("month").optional().trim(),
    body("remarks").optional().trim(),
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

    if (req.body.amount) {
      updates.push("amount = ?");
      values.push(req.body.amount);
    }
    if (req.body.type) {
      updates.push("type = ?");
      values.push(req.body.type);
    }
    if (req.body.month) {
      updates.push("month = ?");
      values.push(req.body.month);
    }
    if (req.body.remarks) {
      updates.push("remarks = ?");
      values.push(req.body.remarks);
    }

    if (updates.length > 0) {
      values.push(parseInt(req.params.id));
      await executeUpdate(
        `UPDATE fees SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }

    logger.info(`Fee updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Fee updated successfully",
    });
  })
);

/**
 * DELETE /api/v1/fees/:id
 * Delete fee record
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

    await executeUpdate("DELETE FROM fees WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Fee deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Fee deleted successfully",
    });
  })
);

export default router;
