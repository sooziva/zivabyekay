import prismaPkg from "@prisma/client";

// Vercel can sometimes bundle `@prisma/client` as CJS. Support both CJS + ESM.
const PrismaClient = prismaPkg?.PrismaClient || prismaPkg?.default?.PrismaClient;
if (!PrismaClient) {
  throw new Error("PrismaClient export not found. Ensure Prisma Client is generated during build.");
}

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

