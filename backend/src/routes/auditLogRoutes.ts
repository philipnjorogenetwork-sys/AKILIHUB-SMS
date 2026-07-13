import express, { Router } from "express";
import { param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";

const router: Router = express.Router();
const logger = new Logger("AuditLogRoutes");

/**
 * POST /api/v1/audit-logs
 * Create audit log (internal use)
 */
router.post(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { userId, action, entityType, entityId, changes, ipAddress } = req.body;

    const result = await executeUpdate(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, JSON.stringify(changes) || null, ipAddress]
    );

    logger.info(
      `Audit log created: ${action} on ${entityType} ${entityId} by user ${userId}`
    );

    res.status(201).json({
      success: true,
      message: "Audit log created",
      auditLogId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/audit-logs
 * Get all audit logs (Admin only)
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const logs = await executeQuery(
      `SELECT id, user_id as userId, action, entity_type as entityType, entity_id as entityId,
              changes, ip_address as ipAddress, created_at as createdAt
       FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await executeQueryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM audit_logs"
    );

    res.json({
      success: true,
      data: logs,
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
 * GET /api/v1/audit-logs/user/:userId
 * Get audit logs for a user
 */
router.get(
  "/user/:userId",
  authMiddleware,
  [param("userId").isInt()],
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const logs = await executeQuery(
      `SELECT id, user_id as userId, action, entity_type as entityType, entity_id as entityId,
              changes, ip_address as ipAddress, created_at as createdAt
       FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [parseInt(req.params.userId), limit, offset]
    );

    const countResult = await executeQueryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ?",
      [parseInt(req.params.userId)]
    );

    res.json({
      success: true,
      data: logs,
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
 * GET /api/v1/audit-logs/entity/:entityType/:entityId
 * Get audit logs for an entity
 */
router.get(
  "/entity/:entityType/:entityId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { entityType, entityId } = req.params;

    const logs = await executeQuery(
      `SELECT id, user_id as userId, action, entity_type as entityType, entity_id as entityId,
              changes, ip_address as ipAddress, created_at as createdAt
       FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC`,
      [entityType, entityId]
    );

    res.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  })
);

/**
 * GET /api/v1/audit-logs/stats
 * Get audit log statistics (Admin only)
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("Admin"),
  asyncHandler(async (req, res) => {
    const totalLogs = await executeQueryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM audit_logs"
    );

    const actionStats = await executeQuery<{
      action: string;
      count: number;
    }>(
      `SELECT action, COUNT(*) as count FROM audit_logs GROUP BY action ORDER BY count DESC`
    );

    const entityStats = await executeQuery<{
      entityType: string;
      count: number;
    }>(
      `SELECT entity_type as entityType, COUNT(*) as count FROM audit_logs 
       GROUP BY entity_type ORDER BY count DESC`
    );

    res.json({
      success: true,
      stats: {
        totalLogs: totalLogs?.count || 0,
        actionStats,
        entityStats,
      },
    });
  })
);

/**
 * DELETE /api/v1/audit-logs/:id
 * Delete audit log (Admin only)
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

    await executeUpdate("DELETE FROM audit_logs WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Audit log deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Audit log deleted successfully",
    });
  })
);

export default router;
