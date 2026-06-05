export * from "@prisma/client";
import { PrismaClient } from "@prisma/client";

/**
 * Zdieľaná inštancia Prisma klienta. V dev režime ju cacheujeme na globále,
 * aby hot-reload nevytváral nové spojenia.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
