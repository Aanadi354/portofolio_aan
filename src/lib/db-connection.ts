import { createConnection, type Connection } from "mariadb";

/**
 * Parse DATABASE_URL into mariadb connection options.
 * The `uri` option in mariadb requires `mariadb://` or `mysql://` prefix
 * but can be unreliable on some OS versions — we parse manually to be safe.
 */
export function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname || "localhost",
    port: parseInt(parsed.port || "3306", 10),
    user: parsed.username || "root",
    password: parsed.password || "",
    database: parsed.pathname.slice(1),
    bigNumberStrings: true,
    connectTimeout: 10000,
  };
}

export async function createDbConnection(): Promise<Connection> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in environment variables");
  return await createConnection(parseDatabaseUrl(url));
}