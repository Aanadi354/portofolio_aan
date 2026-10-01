"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SkillActionState } from "@/types/skill";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseOrder(value: string) {
  const order = Number(value || "0");
  return Number.isInteger(order) && order >= 0 && order <= 2147483647 ? order : null;
}

export async function saveSkillCategory(
  _previousState: SkillActionState,
  formData: FormData,
): Promise<SkillActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const name = getText(formData, "name");
  const description = getText(formData, "description") || null;
  const icon = getText(formData, "icon") || null;
  const order = parseOrder(getText(formData, "order"));
  const idValue = getText(formData, "id");

  if (!name || name.length > 100) {
    return { success: false, message: "Category name is required and must be 100 characters or fewer." };
  }
  if ((description?.length ?? 0) > 500 || (icon?.length ?? 0) > 100) {
    return { success: false, message: "Description or icon exceeds the allowed length." };
  }
  if (order === null) {
    return { success: false, message: "Display order must be a non-negative whole number." };
  }

  try {
    if (idValue) {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id < 1) return { success: false, message: "Invalid category." };
      await prisma.skillCategory.update({ where: { id }, data: { name, description, icon, order } });
    } else {
      await prisma.skillCategory.create({ data: { name, description, icon, order } });
    }
  } catch (error) {
    console.error("Unable to save skill category", error);
    return { success: false, message: "Category could not be saved. Please try again." };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true, message: "Category saved." };
}

export async function deleteSkillCategory(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await prisma.skillCategory.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete skill category", error);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
}

export async function saveSkill(
  _previousState: SkillActionState,
  formData: FormData,
): Promise<SkillActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const name = getText(formData, "name");
  const icon = getText(formData, "icon") || null;
  const proficiencyValue = getText(formData, "proficiency");
  const order = parseOrder(getText(formData, "order"));
  const categoryId = Number(getText(formData, "skillCategoryId"));
  const idValue = getText(formData, "id");
  const proficiency = Number(proficiencyValue || "0");

  if (!name || name.length > 100) {
    return { success: false, message: "Skill name is required and must be 100 characters or fewer." };
  }
  if ((icon?.length ?? 0) > 100) {
    return { success: false, message: "Icon name must be 100 characters or fewer." };
  }
  if (!Number.isInteger(proficiency) || proficiency < 0 || proficiency > 100) {
    return { success: false, message: "Proficiency must be a whole number from 0 to 100." };
  }
  if (order === null) {
    return { success: false, message: "Display order must be a non-negative whole number." };
  }
  if (!Number.isInteger(categoryId) || categoryId < 1 || !(await prisma.skillCategory.findUnique({ where: { id: categoryId }, select: { id: true } }))) {
    return { success: false, message: "Choose a valid category for this skill." };
  }

  try {
    if (idValue) {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id < 1) return { success: false, message: "Invalid skill." };
      await prisma.skill.update({
        where: { id },
        data: { name, icon, proficiency, order, skillCategoryId: categoryId },
      });
    } else {
      await prisma.skill.create({
        data: { name, icon, proficiency, order, skillCategoryId: categoryId },
      });
    }
  } catch (error) {
    console.error("Unable to save skill", error);
    return { success: false, message: "Skill could not be saved. Please try again." };
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
  return { success: true, message: "Skill saved." };
}

export async function deleteSkill(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await prisma.skill.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete skill", error);
  }

  revalidatePath("/admin/skills");
  revalidatePath("/");
}