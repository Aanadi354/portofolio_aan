import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { createPool } from "mariadb";

// ============================================================
// Prisma Client Singleton for Next.js (Prisma ORM v7)
//
// Prisma v7 requires a driver adapter.
// @prisma/adapter-mariadb supports both MySQL and MariaDB.
// Uses createPool (not createConnection) as PrismaMariaDb needs a pool.
// ============================================================

function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname || "localhost",
    port: parseInt(parsed.port || "3306", 10),
    user: parsed.username || "root",
    password: parsed.password || "",
    database: parsed.pathname.slice(1),
    bigNumberStrings: true,
    connectionLimit: 10,
  };
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in environment variables");

  const pool = createPool(parseDatabaseUrl(url));
  const adapter = new PrismaMariaDb(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;