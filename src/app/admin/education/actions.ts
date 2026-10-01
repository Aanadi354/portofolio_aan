"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { EducationActionState } from "@/types/education";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export async function saveEducation(
  _previousState: EducationActionState,
  formData: FormData,
): Promise<EducationActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const institution = getText(formData, "institution");
  const degree = getText(formData, "degree");
  const fieldOfStudy = getText(formData, "fieldOfStudy");
  const startDateValue = getText(formData, "startDate");
  const endDateValue = getText(formData, "endDate");
  const isCurrent = formData.get("isCurrent") === "on";
  const gpaValue = getText(formData, "gpa");
  const description = getText(formData, "description") || null;
  const logoUrl = getText(formData, "logoUrl") || null;
  const orderValue = getText(formData, "order") || "0";
  const idValue = getText(formData, "id");

  if (!institution || !degree || !fieldOfStudy || !startDateValue) {
    return { success: false, message: "Institution, degree, field of study, and start date are required." };
  }
  if (institution.length > 255 || degree.length > 255 || fieldOfStudy.length > 255) {
    return { success: false, message: "Institution, degree, and field of study must be 255 characters or fewer." };
  }

  const startDate = parseDate(startDateValue);
  const endDate = isCurrent || !endDateValue ? null : parseDate(endDateValue);
  if (!startDate || (endDateValue && !isCurrent && !endDate)) {
    return { success: false, message: "Enter valid start and end dates." };
  }
  if (endDate && endDate < startDate) {
    return { success: false, message: "End date cannot be earlier than start date." };
  }

  const gpa = gpaValue ? Number(gpaValue) : null;
  if (gpaValue && (!Number.isFinite(gpa) || gpa! < 0 || gpa! > 4 || !/^\d{1,1}(\.\d{1,2})?$/.test(gpaValue))) {
    return { success: false, message: "GPA must be between 0 and 4, with up to two decimal places." };
  }
  if (logoUrl && logoUrl.length > 500) {
    return { success: false, message: "Logo URL must be 500 characters or fewer." };
  }
  if (logoUrl) {
    try {
      const parsedUrl = new URL(logoUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error();
    } catch {
      return { success: false, message: "Logo URL must be a valid HTTP or HTTPS URL." };
    }
  }

  const order = Number(orderValue);
  if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
    return { success: false, message: "Display order must be a non-negative whole number." };
  }

  const data = {
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    isCurrent,
    gpa,
    description,
    logoUrl,
    order,
  };

  try {
    if (idValue) {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id < 1) {
        return { success: false, message: "Invalid education record." };
      }
      await prisma.education.update({ where: { id }, data });
    } else {
      await prisma.education.create({ data });
    }
  } catch (error) {
    console.error("Unable to save education record", error);
    return { success: false, message: "Education could not be saved. Please try again." };
  }

  revalidatePath("/admin/education");
  return { success: true, message: "Education saved." };
}

export async function deleteEducation(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await prisma.education.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete education record", error);
  }

  revalidatePath("/admin/education");
}