import express, { Router } from "express";
import { body, validationResult } from "express-validator";
import { asyncHandler } from "../middleware/error";
import { strictRateLimit } from "../middleware/rateLimit";
import { authMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import UserService from "../services/UserService";

const router: Router = express.Router();
const logger = new Logger("AuthRoutes");

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post(
  "/register",
  strictRateLimit,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").trim().isLength({ min: 2 }),
    body("role").isIn(["Admin", "teacher", "student", "parent", "finance", "secretary"]),
    body("personId").trim(),
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

    const { email, password, name, role, personId, phone, address } = req.body;

    // Check if user exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    const user = await UserService.createUser({
      email,
      password,
      name,
      role,
      personId,
      phone,
      address,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  })
);

/**
 * POST /api/v1/auth/login
 * Login user and return JWT token
 */
router.post(
  "/login",
  strictRateLimit,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
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

    const { email, password } = req.body;

    try {
      const { user, token, refreshToken } = await UserService.authenticate(
        email,
        password
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        message: "Login successful",
        user,
        token,
        refreshToken,
      });
    } catch (error) {
      logger.warn(`Login failed for: ${email}`);
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  })
);

/**
 * POST /api/v1/auth/refresh-token
 * Refresh JWT token
 */
router.post(
  "/refresh-token",
  [body("refreshToken").trim()],
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    try {
      const jwt = require("jsonwebtoken");
      const { config } = require("../config/config");

      const decoded = jwt.verify(refreshToken, config.auth.jwtSecret);

      const user = await UserService.getUserById(decoded.id);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const newToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          personId: user.personId,
        },
        config.auth.jwtSecret,
        { expiresIn: config.auth.jwtExpiry }
      );

      res.json({
        success: true,
        token: newToken,
      });
    } catch (error) {
      logger.warn("Token refresh failed");
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  })
);

/**
 * POST /api/v1/auth/logout
 * Logout user (invalidate token on client side)
 */
router.post(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    logger.info(`User logged out`);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  })
);

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 */
router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await UserService.getUserById((req as any).user.id);

    res.json({
      success: true,
      user,
    });
  })
);

/**
 * POST /api/v1/auth/change-password
 * Change user password
 */
router.post(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword").isLength({ min: 6 }),
    body("newPassword").isLength({ min: 6 }),
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

    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    try {
      await UserService.changePassword(userId, currentPassword, newPassword);

      logger.info(`Password changed for user: ${userId}`);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  })
);

export default router;
