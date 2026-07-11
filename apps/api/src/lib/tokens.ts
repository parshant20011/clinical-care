import jwt from "jsonwebtoken";
import type { Response } from "express";
import { env, isProd } from "../config/env.js";
import type { Role } from "@clinical/shared";

// JWT payload we sign at login. Keep it minimal — just enough to identify the
// user and their tenant/role without another DB hit on every request.
export interface TokenPayload {
  sub: string; // staff id
  facilityId: string;
  role: Role;
}

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export const ACCESS_COOKIE = "cc_access";
export const REFRESH_COOKIE = "cc_refresh";

export function signAccessToken(p: TokenPayload): string {
  return jwt.sign(p, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(p: TokenPayload): string {
  return jwt.sign(p, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}

// httpOnly cookies: unreadable by page JavaScript (XSS-safe), SameSite=strict
// (CSRF-safe), Secure in production (HTTPS only). See security doc §8.
const baseCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
};

export function setAuthCookies(res: Response, payload: TokenPayload): void {
  res.cookie(ACCESS_COOKIE, signAccessToken(payload), {
    ...baseCookie,
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie(REFRESH_COOKIE, signRefreshToken(payload), {
    ...baseCookie,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, baseCookie);
  res.clearCookie(REFRESH_COOKIE, baseCookie);
}
