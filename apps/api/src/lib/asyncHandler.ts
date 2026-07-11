import type { Request, Response, NextFunction, RequestHandler } from "express";

// Express 4 doesn't catch errors thrown in async handlers automatically.
// Wrapping a handler in asyncHandler forwards any rejection to next(), so the
// central error middleware handles it instead of crashing the process.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
