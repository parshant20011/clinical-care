import type { Role } from "@clinical/shared";

// Augment Express's Request so `req.user` is typed everywhere after the
// requireAuth middleware has run.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        facilityId: string;
        role: Role;
        name: string;
      };
    }
  }
}

export {};
