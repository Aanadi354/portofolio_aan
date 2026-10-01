"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CareerActionState } from "@/types/career";

const careerTypes = ["FULLTIME", "PARTTIME", "INTERNSHIP", "FREELANCE", "CONTRACT", "VOLUNTEER"] as const;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function saveCareer(
  _previousState: CareerActionState,
  formData: FormData,
): Promise<CareerActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const company = getText(formData, "company");
  const position = getText(formData, "position");
  const type = getText(formData, "type");
  const startDateValue = getText(formData, "startDate");
  const endDateValue = getText(formData, "endDate");
  const isCurrent = formData.get("isCurrent") === "on";
  const location = getText(formData, "location") || null;
  const description = getText(formData, "description") || null;
  const logoUrl = getText(formData, "logoUrl") || null;
  const orderValue = getText(formData, "order") || "0";
  const idValue = getText(formData, "id");

  if (!company || !position || !startDateValue) {
    return { success: false, message: "Company, position, and start date are required." };
  }
  if (company.length > 255 || position.length > 255 || !careerTypes.includes(type as (typeof careerTypes)[number])) {
    return { success: false, message: "Enter valid company, position, and career type values." };
  }
  if ((location?.length ?? 0) > 255 || (logoUrl?.length ?? 0) > 500) {
    return { success: false, message: "Location or logo URL exceeds the allowed length." };
  }
  if (logoUrl && !isHttpUrl(logoUrl)) {
    return { success: false, message: "Logo URL must be a valid HTTP or HTTPS URL." };
  }

  const startDate = parseDate(startDateValue);
  const endDate = isCurrent || !endDateValue ? null : parseDate(endDateValue);
  if (!startDate || (endDateValue && !isCurrent && !endDate)) {
    return { success: false, message: "Enter valid start and end dates." };
  }
  if (endDate && endDate < startDate) {
    return { success: false, message: "End date cannot be earlier than start date." };
  }

  const order = Number(orderValue);
  if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
    return { success: false, message: "Display order must be a non-negative whole number." };
  }

  const data = {
    company,
    position,
    type: type as (typeof careerTypes)[number],
    startDate,
    endDate,
    isCurrent,
    location,
    description,
    logoUrl,
    order,
  };

  try {
    if (idValue) {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id < 1) {
        return { success: false, message: "Invalid career record." };
      }
      await prisma.career.update({ where: { id }, data });
    } else {
      await prisma.career.create({ data });
    }
  } catch (error) {
    console.error("Unable to save career record", error);
    return { success: false, message: "Career could not be saved. Please try again." };
  }

  revalidatePath("/admin/career");
  return { success: true, message: "Career saved." };
}

export async function deleteCareer(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await prisma.career.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete career record", error);
  }

  revalidatePath("/admin/career");
}