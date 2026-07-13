import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    personId: string;
  };
  token?: string;
}

/**
 * Verify JWT token and attach user to request
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
      return;
    }

    const decoded = jwt.verify(token, config.auth.jwtSecret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      personId: decoded.personId,
    };
    req.token = token;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

/**
 * Check if user has required role
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
}

/**
 * Verify user owns the resource being accessed
 */
export function ownershipMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
    return;
  }

  const requestedUserId = parseInt(req.params.id);

  // Allow admins to access any user's data
  if (req.user.role === "Admin") {
    next();
    return;
  }

  // Allow users to access only their own data
  if (req.user.id === requestedUserId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: "You do not have permission to access this resource",
  });
}
