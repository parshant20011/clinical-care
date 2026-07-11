import { Router } from "express";
import rateLimit from "express-rate-limit";
import { loginSchema } from "@clinical/shared";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { AppError } from "../../lib/AppError.js";
import { requireAuth } from "../../middleware/auth.js";
import {
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
  REFRESH_COOKIE,
} from "../../lib/tokens.js";
import { authenticate, getProfile } from "./auth.service.js";

const router = Router();

// Tight rate limit on auth to blunt brute-force / credential-stuffing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts, try again later", code: "RATE_LIMITED" },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login — verify credentials, set httpOnly cookies.
router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const payload = await authenticate(email, password);
    setAuthCookies(res, payload);
    const profile = await getProfile(payload.sub);
    res.json({ user: profile });
  }),
);

// POST /api/auth/logout — clear cookies.
router.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    clearAuthCookies(res);
    res.json({ ok: true });
  }),
);

// POST /api/auth/refresh — issue a fresh access token from a valid refresh cookie.
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw AppError.unauthorized("No refresh token");
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw AppError.unauthorized("Invalid refresh token");
    }
    setAuthCookies(res, { sub: payload.sub, facilityId: payload.facilityId, role: payload.role });
    res.json({ ok: true });
  }),
);

// GET /api/auth/me — current user (used by the frontend AuthContext).
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await getProfile(req.user!.id);
    res.json({ user: profile });
  }),
);

export default router;
