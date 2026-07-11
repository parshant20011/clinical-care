import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";

// Map HTTP method → audit action verb.
const ACTION_BY_METHOD: Record<string, string> = {
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
};

function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  // One-way hash so we can correlate activity from the same source without
  // storing the raw IP (which is personal information).
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

// auditMutations: records who did what, when, from where — for every state-
// changing request that succeeds. Read requests are NOT logged here (see
// security doc §4 for the read-access-logging enhancement). Deliberately stores
// NO request body / PII — only entity + id.
export function auditMutations(entity: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const action = ACTION_BY_METHOD[req.method];
    if (!action) return next(); // not a mutation

    // Log only after the response is sent, and only if it succeeded (2xx).
    res.on("finish", () => {
      if (res.statusCode < 200 || res.statusCode >= 300) return;
      if (!req.user) return;

      prisma.auditLog
        .create({
          data: {
            facilityId: req.user.facilityId,
            actorId: req.user.id,
            action,
            entity,
            entityId: (req.params.id as string) ?? null,
            ipHash: hashIp(req.ip),
          },
        })
        .catch((err) => logger.error({ err }, "Failed to write audit log"));
    });

    next();
  };
}
