"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ProfileActionState } from "@/types/profile";

const maxImageSize = 5 * 1024 * 1024;
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "profiles");

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getImageExtension(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return ".png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return ".jpg";
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) return ".webp";
  return null;
}

function isValidResumeUrl(value: string | null) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function saveProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const name = getText(formData, "name");
  const headline = getText(formData, "headline");
  const bio = getText(formData, "bio");
  const email = getText(formData, "email").toLowerCase();
  const location = getText(formData, "location") || null;
  const phone = getText(formData, "phone") || null;
  const resumeUrl = getText(formData, "resumeUrl") || null;

  if (!name || !headline || !bio || !email) {
    return { success: false, message: "Name, headline, bio, and email are required." };
  }
  if (name.length > 255 || headline.length > 500 || email.length > 255) {
    return { success: false, message: "One or more fields exceed the allowed length." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Enter a valid email address." };
  }
  if (!isValidResumeUrl(resumeUrl)) {
    return { success: false, message: "Résumé URL must use HTTP, HTTPS, or a local path." };
  }
  if ((location?.length ?? 0) > 255 || (phone?.length ?? 0) > 50 || (resumeUrl?.length ?? 0) > 500) {
    return { success: false, message: "One or more fields exceed the allowed length." };
  }

  const imageEntry = formData.get("profileImage");
  let newImageUrl: string | null = null;
  let savedImagePath: string | null = null;
  let existingProfile: Awaited<ReturnType<typeof prisma.profile.findFirst>> = null;

  try {
    existingProfile = await prisma.profile.findFirst({ orderBy: { id: "asc" } });

    if (imageEntry instanceof File && imageEntry.size > 0) {
      if (imageEntry.size > maxImageSize) {
        return { success: false, message: "The profile image must be 5 MB or smaller." };
      }

      const imageBytes = Buffer.from(await imageEntry.arrayBuffer());
      const extension = getImageExtension(imageBytes);
      if (!extension) {
        return { success: false, message: "Use a valid JPEG, PNG, or WebP image." };
      }

      const fileName = `${randomUUID()}${extension}`;
      savedImagePath = path.join(uploadDirectory, fileName);
      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(savedImagePath, imageBytes, { flag: "wx" });
      newImageUrl = `/uploads/profiles/${fileName}`;
    } else if (imageEntry !== null && typeof imageEntry === "string" && imageEntry !== "") {
      return { success: false, message: "Choose a valid image file." };
    }

    const profileData = {
      name,
      headline,
      bio,
      email,
      location,
      phone,
      resumeUrl,
      profileImage: newImageUrl ?? existingProfile?.profileImage ?? null,
    };

    if (existingProfile) {
      await prisma.profile.update({ where: { id: existingProfile.id }, data: profileData });
    } else {
      await prisma.profile.create({ data: profileData });
    }
  } catch (error) {
    if (savedImagePath) await unlink(savedImagePath).catch(() => undefined);
    console.error("Unable to save profile", error);
    return { success: false, message: "Profile could not be saved. Please try again." };
  }

  if (newImageUrl && existingProfile?.profileImage?.startsWith("/uploads/profiles/")) {
    const oldImagePath = path.join(uploadDirectory, path.basename(existingProfile.profileImage));
    if (oldImagePath !== savedImagePath) await unlink(oldImagePath).catch(() => undefined);
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true, message: "Profile saved." };
}