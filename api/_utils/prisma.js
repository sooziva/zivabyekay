import { PrismaClient } from "@prisma/client";

// Vercel serverless: reuse Prisma client across invocations when possible.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__zb_prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__zb_prisma = prisma;
}

