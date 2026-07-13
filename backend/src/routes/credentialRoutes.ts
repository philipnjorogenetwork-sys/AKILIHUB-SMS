import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";
import bcrypt from "bcryptjs";

const router: Router = express.Router();
const logger = new Logger("CredentialRoutes");

/**
 * POST /api/v1/credentials/generate
 * Generate credentials
 */
router.post(
  "/generate",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    body("userId").isInt(),
    body("username").trim(),
    body("password").isLength({ min: 8 }),
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

    const { userId, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await executeUpdate(
      `INSERT INTO credentials (user_id, username, password) VALUES (?, ?, ?)`,
      [userId, username, hashedPassword]
    );

    logger.info(`Credentials generated for user ${userId}`);

    res.status(201).json({
      success: true,
      message: "Credentials generated successfully",
      credentialId: result.lastInsertId,
    });
  })
);

/**
 * GET /api/v1/credentials/:userId
 * Get credentials
 */
router.get(
  "/:userId",
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

    const credential = await executeQueryOne(
      "SELECT id, user_id as userId, username FROM credentials WHERE user_id = ?",
      [parseInt(req.params.userId)]
    );

    if (!credential) {
      throw new APIError(404, "Credentials not found");
    }

    res.json({
      success: true,
      credential,
    });
  })
);

/**
 * PUT /api/v1/credentials/:id/password
 * Reset password
 */
router.put(
  "/:id/password",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [param("id").isInt(), body("password").isLength({ min: 8 })],
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

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await executeUpdate(
      "UPDATE credentials SET password = ? WHERE id = ?",
      [hashedPassword, parseInt(req.params.id)]
    );

    logger.info(`Password reset for credential ${req.params.id}`);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  })
);

/**
 * DELETE /api/v1/credentials/:id
 * Delete credentials
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

    await executeUpdate("DELETE FROM credentials WHERE id = ?", [
      parseInt(req.params.id),
    ]);

    logger.info(`Credentials deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "Credentials deleted successfully",
    });
  })
);

export default router;
