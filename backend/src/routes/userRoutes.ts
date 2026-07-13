import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware, ownershipMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import UserService from "../services/UserService";

const router: Router = express.Router();
const logger = new Logger("UserRoutes");

/**
 * GET /api/v1/users
 * Get all users (Admin only)
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { users, total } = await UserService.getAllUsers(page, limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

/**
 * GET /api/v1/users/:id
 * Get user by ID
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

    const user = await UserService.getUserById(parseInt(req.params.id));

    if (!user) {
      throw new APIError(404, "User not found");
    }

    res.json({
      success: true,
      user,
    });
  })
);

/**
 * GET /api/v1/users/role/:role
 * Get users by role
 */
router.get(
  "/role/:role",
  authMiddleware,
  roleMiddleware("Admin"),
  asyncHandler(async (req, res) => {
    const users = await UserService.getUsersByRole(req.params.role);

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  })
);

/**
 * PUT /api/v1/users/:id
 * Update user profile
 */
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("name").optional().trim(),
    body("phone").optional().trim(),
    body("address").optional().trim(),
    body("status").optional().isIn(["active", "inactive"]),
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

    const userId = parseInt(req.params.id);
    const requestingUser = (req as any).user;

    // Users can only update their own profile unless they're admin
    if (requestingUser.id !== userId && requestingUser.role !== "Admin") {
      throw new APIError(403, "You can only update your own profile");
    }

    const user = await UserService.updateUser(userId, req.body);

    logger.info(`User updated: ${userId}`);

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  })
);

/**
 * DELETE /api/v1/users/:id
 * Delete user (Admin only)
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

    await UserService.deleteUser(parseInt(req.params.id));

    logger.info(`User deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  })
);

/**
 * GET /api/v1/users/stats
 * Get user statistics (Admin only)
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("Admin"),
  asyncHandler(async (req, res) => {
    const stats = await UserService.getUserStats();

    res.json({
      success: true,
      stats,
    });
  })
);

export default router;
