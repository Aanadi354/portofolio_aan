import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma ORM v7 Configuration
 * 
 * In Prisma v7, the datasource URL is configured here (not in schema.prisma).
 * See: https://pris.ly/d/config-datasource
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});