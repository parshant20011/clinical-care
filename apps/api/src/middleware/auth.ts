import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/AppError.js";
import { ACCESS_COOKIE, verifyAccessToken } from "../lib/tokens.js";

// requireAuth: verify the access-token cookie, confirm the staff account still
// exists and is active, and attach a typed `req.user` (id, facilityId, role,
// name). Everything downstream — RBAC, tenant scoping, audit — relies on this.
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) throw AppError.unauthorized();

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw AppError.unauthorized("Session expired");
    }

    // Confirm the account is still valid (deactivation = instant lockout).
    const staff = await prisma.staff.findUnique({ where: { id: payload.sub } });
    if (!staff || !staff.active) throw AppError.unauthorized("Account inactive");

    req.user = {
      id: staff.id,
      facilityId: staff.facilityId,
      role: staff.role,
      name: staff.name,
    };
    next();
  } catch (err) {
    next(err);
  }
}
