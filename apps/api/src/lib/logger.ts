import pino from "pino";
import { env } from "../config/env.js";

// Structured logger. In production, PII must never reach the logs (security
// doc §3): redact anything that could carry identifiers. Add paths here as new
// fields appear.
export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "*.password",
      "*.passwordHash",
      "*.ihi",
      "*.medicareCard",
      "*.concessionNumber",
    ],
    remove: true,
  },
});
