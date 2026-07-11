import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/AppError.js";
import { logger } from "../lib/logger.js";

// Central error handler (must be the LAST middleware). Maps known error types
// to clean JSON. Never leaks stack traces or DB internals to the client.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, code: err.code });
    return;
  }

  // Unknown/unexpected: log the detail server-side, return a generic message.
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error", code: "INTERNAL" });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found", code: "NOT_FOUND" });
}
