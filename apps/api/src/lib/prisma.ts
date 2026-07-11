import { PrismaClient } from "@prisma/client";

// Single shared Prisma client for the whole process. In dev with hot-reload
// (tsx watch) we cache it on globalThis so repeated reloads don't open a new
// connection pool each time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
