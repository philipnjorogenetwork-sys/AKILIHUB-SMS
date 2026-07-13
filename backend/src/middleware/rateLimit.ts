import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

/**
 * In-memory rate limiting middleware for high performance
 * For production with 2000+ users, use Redis instead
 */
export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Skip rate limiting if disabled
  if (config.api.rateLimitMaxRequests === 0) {
    next();
    return;
  }

  const key = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = config.api.rateLimitWindowMs;
  const maxRequests = config.api.rateLimitMaxRequests;

  // Initialize or check rate limit record
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    const record = rateLimitStore[key];

    // Reset if window has passed
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }

    // Check limit
    if (record.count > maxRequests) {
      const resetIn = Math.ceil((record.resetTime - now) / 1000);
      res.status(429).json({
        success: false,
        message: "Too many requests",
        retryAfter: resetIn,
      });
      return;
    }
  }

  // Add headers
  res.setHeader(
    "X-RateLimit-Limit",
    maxRequests.toString()
  );
  res.setHeader(
    "X-RateLimit-Remaining",
    (maxRequests - rateLimitStore[key].count).toString()
  );
  res.setHeader(
    "X-RateLimit-Reset",
    Math.ceil(rateLimitStore[key].resetTime / 1000).toString()
  );

  next();
}

/**
 * Endpoint-specific rate limiting (stricter for sensitive endpoints)
 */
export function strictRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key = `strict:${req.ip || req.connection.remoteAddress || "unknown"}`;
  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxRequests = 5; // 5 requests per minute

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    const record = rateLimitStore[key];

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }

    if (record.count > maxRequests) {
      const resetIn = Math.ceil((record.resetTime - now) / 1000);
      res.status(429).json({
        success: false,
        message: "Too many requests on this endpoint",
        retryAfter: resetIn,
      });
      return;
    }
  }

  next();
}

/**
 * Clean up old rate limit records (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} rate limit records`);
  }
}

// Clean up rate limit store every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
