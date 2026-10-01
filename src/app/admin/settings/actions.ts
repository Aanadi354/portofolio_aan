"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SettingType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SiteSettingActionState } from "@/types/site-setting";

const brandingKeys = ["site_title", "site_description", "favicon"];
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "settings");
const maxFaviconSize = 1024 * 1024;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFaviconExtension(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return ".png";
  if (bytes.length >= 4 && bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) return ".ico";
  return null;
}

async function removeLocalFavicon(url: string | null) {
  if (!url?.startsWith("/uploads/settings/")) return;
  await unlink(path.join(uploadDirectory, path.basename(url))).catch(() => undefined);
}

function refreshSettings() {
  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/api/site-icon");
}

export async function saveBranding(
  _previousState: SiteSettingActionState,
  formData: FormData,
): Promise<SiteSettingActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const title = getText(formData, "siteTitle");
  const description = getText(formData, "siteDescription");
  const removeFavicon = formData.get("removeFavicon") === "on";
  const imageEntry = formData.get("faviconFile");

  if (!title || title.length > 255) {
    return { success: false, message: "Website title is required and must be 255 characters or fewer." };
  }
  if (description.length > 500) {
    return { success: false, message: "Website description must be 500 characters or fewer." };
  }
  if (imageEntry instanceof File && imageEntry.size > maxFaviconSize) {
    return { success: false, message: "Favicon must be 1 MB or smaller." };
  }
  if (imageEntry !== null && !(imageEntry instanceof File) && imageEntry !== "") {
    return { success: false, message: "Choose a valid PNG or ICO file." };
  }

  const existingFavicon = await prisma.siteSetting.findUnique({ where: { key: "favicon" } });
  let savedImagePath: string | null = null;
  let newFaviconUrl: string | null = null;

  try {
    if (imageEntry instanceof File && imageEntry.size > 0) {
      const bytes = Buffer.from(await imageEntry.arrayBuffer());
      const extension = getFaviconExtension(bytes);
      if (!extension) return { success: false, message: "Use a valid PNG or ICO favicon." };

      const fileName = `${randomUUID()}${extension}`;
      savedImagePath = path.join(uploadDirectory, fileName);
      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(savedImagePath, bytes, { flag: "wx" });
      newFaviconUrl = `/uploads/settings/${fileName}`;
    }

    const faviconValue = newFaviconUrl ?? (removeFavicon ? null : existingFavicon?.value ?? "/favicon.ico");
    await prisma.$transaction([
      prisma.siteSetting.upsert({
        where: { key: "site_title" },
        create: { key: "site_title", value: title, type: SettingType.STRING, label: "Site Title", description: "Main website title", group: "general" },
        update: { value: title },
      }),
      prisma.siteSetting.upsert({
        where: { key: "site_description" },
        create: { key: "site_description", value: description, type: SettingType.STRING, label: "Site Description", description: "Meta description", group: "general" },
        update: { value: description },
      }),
      prisma.siteSetting.upsert({
        where: { key: "favicon" },
        create: { key: "favicon", value: faviconValue, type: SettingType.IMAGE, label: "Favicon", description: "Website favicon", group: "general" },
        update: { value: faviconValue },
      }),
    ]);
  } catch (error) {
    if (savedImagePath) await unlink(savedImagePath).catch(() => undefined);
    console.error("Unable to save site branding", error);
    return { success: false, message: "Branding could not be saved. Please try again." };
  }

  if (newFaviconUrl || removeFavicon) await removeLocalFavicon(existingFavicon?.value ?? null);
  refreshSettings();
  return { success: true, message: "Branding saved." };
}

export async function saveGlobalSetting(
  _previousState: SiteSettingActionState,
  formData: FormData,
): Promise<SiteSettingActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const key = getText(formData, "key").toLowerCase();
  const label = getText(formData, "label");
  const description = getText(formData, "description") || null;
  const group = getText(formData, "group") || "general";
  const typeValue = getText(formData, "type");
  const idValue = getText(formData, "id");
  const valueEntry = formData.get("value");
  const value = typeValue === SettingType.BOOLEAN
    ? (valueEntry === "on" ? "true" : "false")
    : typeof valueEntry === "string" ? valueEntry.trim() : "";

  if (!/^[a-z][a-z0-9_]{0,99}$/.test(key) || brandingKeys.includes(key)) {
    return { success: false, message: "Use a unique lowercase key (letters, numbers, underscores). Branding keys are managed above." };
  }
  if (!label || label.length > 255 || group.length > 100 || (description?.length ?? 0) > 500) {
    return { success: false, message: "Enter a label and keep label, group, and description within their length limits." };
  }
  if (!Object.values(SettingType).includes(typeValue as SettingType)) {
    return { success: false, message: "Choose a valid setting type." };
  }
  if (typeValue === SettingType.NUMBER && value !== "" && !Number.isFinite(Number(value))) {
    return { success: false, message: "Number settings must contain a valid number." };
  }
  if (typeValue === SettingType.JSON && value !== "") {
    try {
      JSON.parse(value);
    } catch {
      return { success: false, message: "JSON settings must contain valid JSON." };
    }
  }

  try {
    if (idValue) {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id < 1) return { success: false, message: "Invalid setting." };
      const existing = await prisma.siteSetting.findUnique({ where: { id }, select: { key: true } });
      if (!existing || brandingKeys.includes(existing.key)) {
        return { success: false, message: "This setting cannot be edited here." };
      }
      await prisma.siteSetting.update({ where: { id }, data: { key, label, description, group, type: typeValue as SettingType, value } });
    } else {
      await prisma.siteSetting.create({ data: { key, label, description, group, type: typeValue as SettingType, value } });
    }
  } catch (error) {
    console.error("Unable to save global setting", error);
    return { success: false, message: "Setting could not be saved. Check the key is unique and try again." };
  }

  refreshSettings();
  return { success: true, message: "Setting saved." };
}

export async function deleteGlobalSetting(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    const setting = await prisma.siteSetting.findUnique({ where: { id }, select: { key: true } });
    if (!setting || brandingKeys.includes(setting.key)) return;
    await prisma.siteSetting.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete global setting", error);
  }

  refreshSettings();
}