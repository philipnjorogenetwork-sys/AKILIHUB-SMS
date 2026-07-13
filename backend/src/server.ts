import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import { config, validateConfig } from "./config/config";
import { Logger, requestLogger } from "./middleware/logger";
import {
  errorHandler,
  notFoundHandler,
  APIError,
} from "./middleware/error";
import { rateLimitMiddleware, cleanupRateLimitStore } from "./middleware/rateLimit";
import { closePool } from "./config/database";

// Load environment variables
dotenv.config();

// Validate configuration
validateConfig();

const logger = new Logger("SERVER");
const app: Express = express();

/**
 * Trust proxy - important for rate limiting with reverse proxies
 */
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : 0);

/**
 * Security Middleware
 */
// Helmet helps secure Express apps
app.use(helmet());

// CORS configuration for high-concurrency environment
app.use(
  cors({
    origin: config.api.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours - important for reducing preflight requests
  })
);

/**
 * Body Parser Middleware
 */
// Compression middleware to reduce bandwidth
app.use(compression({ level: config.performance.compressionLevel }));

// JSON parser
app.use(
  express.json({
    limit: config.performance.maxJsonSize,
  })
);

// URL-encoded parser
app.use(
  express.urlencoded({
    limit: config.performance.maxUrlEncodedSize,
    extended: true,
  })
);

/**
 * Logging and Monitoring Middleware
 */
app.use(requestLogger);

/**
 * Rate Limiting Middleware (critical for handling 2000+ users)
 */
app.use(rateLimitMiddleware);

/**
 * Health Check Endpoint (before authentication)
 */
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Metrics Endpoint (for monitoring)
 */
app.get("/metrics", (req: Request, res: Response) => {
  const memory = process.memoryUsage();
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
    },
    version: config.api.version,
  });
});

/**
 * API Routes
 * All routes are under /api/v1 namespace
 */
const apiPrefix = `${config.api.prefix}/${config.api.version}`;

// Import route handlers
import credentialRoutes from "./routes/credentialRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import parentRoutes from "./routes/parentRoutes";
import classroomRoutes from "./routes/classroomRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import courseRoutes from "./routes/courseRoutes";
import feeRoutes from "./routes/feeRoutes";
import auditLogRoutes from "./routes/auditLogRoutes";

// Register routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/credentials`, credentialRoutes);
app.use(`${apiPrefix}/students`, studentRoutes);
app.use(`${apiPrefix}/teachers`, teacherRoutes);
app.use(`${apiPrefix}/parents`, parentRoutes);
app.use(`${apiPrefix}/classrooms`, classroomRoutes);
app.use(`${apiPrefix}/attendance`, attendanceRoutes);
app.use(`${apiPrefix}/grades`, gradeRoutes);
app.use(`${apiPrefix}/courses`, courseRoutes);
app.use(`${apiPrefix}/fees`, feeRoutes);
app.use(`${apiPrefix}/audit-logs`, auditLogRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Graceful Shutdown Handler
 */
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    logger.info("HTTP server closed");
    await closePool();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    logger.info("HTTP server closed");
    await closePool();
    process.exit(0);
  });
});

/**
 * Start Server
 */
const PORT = Number(process.env.PORT || config.server.port);
const HOST = process.env.HOST || "127.0.0.1";
const server = app.listen(PORT, HOST, () => {
  logger.info(`Server running on ${HOST}:${PORT}`, {
    environment: config.server.nodeEnv,
    apiPrefix,
    rateLimit: `${config.api.rateLimitMaxRequests} requests per ${config.api.rateLimitWindowMs}ms`,
    dbConnections: `${config.database.connectionLimit} pool size`,
  });

  if (process.send) {
    process.send("SERVER_READY");
  }
});

// Periodic cleanup of rate limit store
setInterval(() => {
  cleanupRateLimitStore();
}, 30000); // Every 30 seconds

export default app;
