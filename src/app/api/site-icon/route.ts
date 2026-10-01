import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const publicDirectory = path.join(process.cwd(), "public");
const fallbackPath = path.join(publicDirectory, "favicon.ico");

function contentType(filePath: string) {
  return path.extname(filePath).toLowerCase() === ".png" ? "image/png" : "image/x-icon";
}

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "favicon" }, select: { value: true } });
  const value = setting?.value ?? "";
  const selectedPath = value.startsWith("/uploads/settings/")
    ? path.join(publicDirectory, "uploads", "settings", path.basename(value))
    : fallbackPath;
  const selectedType = contentType(selectedPath);

  try {
    const file = await readFile(selectedPath);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": selectedType,
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    const fallback = await readFile(fallbackPath);
    return new Response(new Uint8Array(fallback), {
      headers: {
        "Content-Type": "image/x-icon",
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}