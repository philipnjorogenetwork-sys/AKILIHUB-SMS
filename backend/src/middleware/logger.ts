import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { config } from "../config/config";

// Ensure log directory exists
const logDir = config.logging.filePath;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log levels: 0=error, 1=warn, 2=info, 3=debug
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[config.logging.level as keyof typeof LOG_LEVELS] || 2;

/**
 * Logger utility for consistent logging across the application
 */
export class Logger {
  private context: string;

  constructor(context: string = "APP") {
    this.context = context;
  }

  private formatMessage(level: string, message: string): string {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] [${this.context}] ${message}`;
  }

  private writeLog(level: string, message: string, data?: any): void {
    const formatted = this.formatMessage(level, message);
    const logEntry = data ? `${formatted}\n${JSON.stringify(data, null, 2)}` : formatted;

    // Console output
    const logFn = console[level as keyof typeof console] || console.log;
    logFn(formatted, data || "");

    // File output (async, non-blocking)
    if (config.server.isProduction) {
      const logFile = path.join(logDir, `${level}.log`);
      fs.appendFile(logFile, logEntry + "\n", (err) => {
        if (err) console.error("Error writing to log file:", err);
      });
    }
  }

  error(message: string, data?: any): void {
    if (currentLevel >= LOG_LEVELS.error) {
      this.writeLog("error", message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (currentLevel >= LOG_LEVELS.warn) {
      this.writeLog("warn", message, data);
    }
  }

  info(message: string, data?: any): void {
    if (currentLevel >= LOG_LEVELS.info) {
      this.writeLog("info", message, data);
    }
  }

  debug(message: string, data?: any): void {
    if (currentLevel >= LOG_LEVELS.debug) {
      this.writeLog("debug", message, data);
    }
  }
}

/**
 * Request logging middleware
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const logger = new Logger("HTTP");

  // Log incoming request
  logger.debug(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";
    logger[logLevel as keyof Logger](
      `${req.method} ${req.originalUrl} - ${res.statusCode}`,
      { duration: `${duration}ms` }
    );
  });

  next();
}

export default Logger;
