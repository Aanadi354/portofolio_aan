"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SocialLinkActionState } from "@/types/social-link";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function saveSocialLink(
  _previousState: SocialLinkActionState,
  formData: FormData,
): Promise<SocialLinkActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const platform = getText(formData, "platform");
  const label = getText(formData, "label");
  const url = getText(formData, "url");
  const icon = getText(formData, "icon") || null;
  const orderValue = getText(formData, "order") || "0";
  const isActive = formData.get("isActive") === "on";
  const idValue = getText(formData, "id");
  const order = Number(orderValue);

  if (!platform || !label || !url) {
    return { success: false, message: "Platform, label, and URL are required." };
  }
  if (platform.length > 100 || label.length > 100 || url.length > 500 || (icon?.length ?? 0) > 100) {
    return { success: false, message: "One or more fields exceed the allowed length." };
  }
  if (!isHttpUrl(url)) {
    return { success: false, message: "Social URL must use HTTP or HTTPS." };
  }
  if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
    return { success: false, message: "Display order must be a non-negative whole number." };
  }

  try {
    if (idValue) {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id < 1) return { success: false, message: "Invalid social link." };
      await prisma.socialLink.update({
        where: { id },
        data: { platform, label, url, icon, order, isActive },
      });
    } else {
      await prisma.socialLink.create({
        data: { platform, label, url, icon, order, isActive },
      });
    }
  } catch (error) {
    console.error("Unable to save social link", error);
    return { success: false, message: "Social link could not be saved. Please try again." };
  }

  revalidatePath("/admin/social-links");
  revalidatePath("/");
  return { success: true, message: "Social link saved." };
}

export async function deleteSocialLink(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await prisma.socialLink.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete social link", error);
  }

  revalidatePath("/admin/social-links");
  revalidatePath("/");
}