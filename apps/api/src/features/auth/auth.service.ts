import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import type { TokenPayload } from "../../lib/tokens.js";

// Verify credentials and return the token payload for a valid, active login.
// Uses a constant "invalid credentials" message for both "no such email" and
// "wrong password" so an attacker can't tell which emails exist.
export async function authenticate(email: string, password: string): Promise<TokenPayload> {
  const staff = await prisma.staff.findUnique({ where: { email } });
  const genericError = AppError.unauthorized("Invalid email or password");

  if (!staff) {
    // Still run a hash compare to keep timing roughly constant (avoids leaking
    // which emails exist via response time).
    await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidin");
    throw genericError;
  }

  if (!staff.active) throw AppError.forbidden("Account is deactivated");

  const ok = await bcrypt.compare(password, staff.passwordHash);
  if (!ok) throw genericError;

  return { sub: staff.id, facilityId: staff.facilityId, role: staff.role };
}

// Load the public profile of the logged-in user (for GET /auth/me).
export async function getProfile(staffId: string) {
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: { id: true, name: true, email: true, role: true, shift: true, facilityId: true },
  });
  if (!staff) throw AppError.unauthorized();
  return staff;
}
