import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import authRoutes from "./features/auth/auth.routes.js";
import residentsRoutes from "./features/residents/residents.routes.js";

// Build the Express app WITHOUT starting it — so tests (supertest) can import
// `app` directly, and server.ts can add listening.
export function createApp() {
  const app = express();

  // Trust the first proxy (needed for correct req.ip behind a load balancer).
  app.set("trust proxy", 1);

  // Security headers (CSP, HSTS, etc.) in one line.
  app.use(helmet());

  // Only the known frontend origin may call the API, and it may send cookies.
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  // A gentle global rate limit (auth has its own tighter one).
  app.use(rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

  // Health check (no auth) — used by load balancers / uptime checks.
  app.get("/api/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

  // Feature routers.
  app.use("/api/auth", authRoutes);
  app.use("/api/residents", residentsRoutes);

  // 404 for unknown routes, then the central error handler (must be last).
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
