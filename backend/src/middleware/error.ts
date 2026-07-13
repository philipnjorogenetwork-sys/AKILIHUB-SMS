import { Request, Response, NextFunction } from "express";

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isDevelopment = process.env.NODE_ENV === "development";

  let statusCode = 500;
  let message = "Internal server error";
  let code = "INTERNAL_ERROR";

  if (error instanceof APIError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || "API_ERROR";
  } else if (error instanceof SyntaxError) {
    statusCode = 400;
    message = "Invalid JSON";
    code = "INVALID_JSON";
  }

  console.error(`[${code}] ${message}:`, error);

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(isDevelopment && { stack: error.stack }),
  });
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new APIError(
    404,
    `Route ${req.originalUrl} not found`,
    "NOT_FOUND"
  );
  next(error);
}

/**
 * Request validation error handler
 */
export function validationErrorHandler(errors: any[]) {
  const messages = errors.map((err) => `${err.param}: ${err.msg}`);
  throw new APIError(
    400,
    `Validation failed: ${messages.join(", ")}`,
    "VALIDATION_ERROR"
  );
}
