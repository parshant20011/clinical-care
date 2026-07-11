import type { Request, Response, NextFunction } from "express";
import { can, type Resource, type Action } from "@clinical/shared";
import { AppError } from "../lib/AppError.js";

// requirePermission: server-side authorization. The frontend hides buttons a
// role can't use, but that's only cosmetic — THIS is the real gate. Reuses the
// single shared permission map (packages/shared/src/permissions.ts) so the API
// and UI can never disagree about who can do what.
export function requirePermission(resource: Resource, action: Action) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(AppError.unauthorized());
    if (!can(req.user.role, resource, action)) {
      return next(AppError.forbidden(`Your role cannot ${action} ${resource}`));
    }
    next();
  };
}
