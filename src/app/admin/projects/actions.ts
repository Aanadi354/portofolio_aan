"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ProjectActionState } from "@/types/project";

const maxImageSize = 5 * 1024 * 1024;
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "projects");
const projectStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? undefined : date;
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

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function removeLocalCover(url: string | null) {
  if (!url?.startsWith("/uploads/projects/")) return;
  const imagePath = path.join(uploadDirectory, path.basename(url));
  await unlink(imagePath).catch(() => undefined);
}

export async function saveProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Session expired. Sign in again before saving." };
  }

  const title = getText(formData, "title");
  const slug = getText(formData, "slug").toLowerCase();
  const description = getText(formData, "description");
  const content = getText(formData, "content") || null;
  const stack = getText(formData, "techStack").split(",").map((item) => item.trim()).filter(Boolean);
  const liveUrl = getText(formData, "liveUrl") || null;
  const githubUrl = getText(formData, "githubUrl") || null;
  const status = getText(formData, "status");
  const featured = formData.get("featured") === "on";
  const orderValue = getText(formData, "order") || "0";
  const startDateValue = getText(formData, "startDate");
  const endDateValue = getText(formData, "endDate");
  const removeCover = formData.get("removeCover") === "on";
  const imageEntry = formData.get("coverImage");
  const idValue = getText(formData, "id");

  if (!title || !slug || !description || stack.length === 0) {
    return { success: false, message: "Title, slug, description, and at least one technology are required." };
  }
  if (title.length > 255 || slug.length > 255 || description.length > 60000 || (content?.length ?? 0) > 100000) {
    return { success: false, message: "One or more project fields exceed the allowed length." };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { success: false, message: "Slug may contain lowercase letters, numbers, and single hyphens." };
  }
  if (!projectStatuses.includes(status as (typeof projectStatuses)[number])) {
    return { success: false, message: "Choose a valid project status." };
  }
  if (stack.length > 30 || stack.some((item) => item.length > 100)) {
    return { success: false, message: "Enter up to 30 technologies, each 100 characters or fewer." };
  }
  if ((liveUrl?.length ?? 0) > 500 || (githubUrl?.length ?? 0) > 500) {
    return { success: false, message: "Project URLs must be 500 characters or fewer." };
  }
  if ((liveUrl && !isHttpUrl(liveUrl)) || (githubUrl && !isHttpUrl(githubUrl))) {
    return { success: false, message: "Demo and GitHub URLs must use HTTP or HTTPS." };
  }

  const startDate = parseDate(startDateValue);
  const endDate = parseDate(endDateValue);
  if (startDate === undefined || endDate === undefined) {
    return { success: false, message: "Enter valid project start and end dates." };
  }
  if (startDate && endDate && endDate < startDate) {
    return { success: false, message: "End date cannot be earlier than start date." };
  }
  const order = Number(orderValue);
  if (!Number.isInteger(order) || order < 0 || order > 2147483647) {
    return { success: false, message: "Display order must be a non-negative whole number." };
  }
  if (imageEntry instanceof File && imageEntry.size > maxImageSize) {
    return { success: false, message: "The cover image must be 5 MB or smaller." };
  }
  if (imageEntry !== null && !(imageEntry instanceof File) && imageEntry !== "") {
    return { success: false, message: "Choose a valid image file." };
  }

  let projectId: number | null = null;
  if (idValue) {
    projectId = Number(idValue);
    if (!Number.isInteger(projectId) || projectId < 1) {
      return { success: false, message: "Invalid project." };
    }
  }

  const existingProject = projectId ? await prisma.project.findUnique({ where: { id: projectId } }) : null;
  if (projectId && !existingProject) {
    return { success: false, message: "Project not found. Refresh the page and try again." };
  }

  let savedImagePath: string | null = null;
  let newImageUrl: string | null = null;
  try {
    if (imageEntry instanceof File && imageEntry.size > 0) {
      const bytes = Buffer.from(await imageEntry.arrayBuffer());
      const extension = getImageExtension(bytes);
      if (!extension) {
        return { success: false, message: "Use a valid JPEG, PNG, or WebP cover image." };
      }

      const fileName = `${randomUUID()}${extension}`;
      savedImagePath = path.join(uploadDirectory, fileName);
      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(savedImagePath, bytes, { flag: "wx" });
      newImageUrl = `/uploads/projects/${fileName}`;
    }

    const projectData = {
      title,
      slug,
      description,
      content,
      techStack: JSON.stringify(stack),
      liveUrl,
      githubUrl,
      status: status as (typeof projectStatuses)[number],
      featured,
      order,
      startDate,
      endDate,
      coverImage: newImageUrl ?? (removeCover ? null : existingProject?.coverImage ?? null),
    };

    if (existingProject) {
      await prisma.project.update({ where: { id: existingProject.id }, data: projectData });
    } else {
      await prisma.project.create({ data: projectData });
    }
  } catch (error) {
    if (savedImagePath) await unlink(savedImagePath).catch(() => undefined);
    console.error("Unable to save project", error);
    return { success: false, message: "Project could not be saved. Check the slug and try again." };
  }

  if (newImageUrl || removeCover) await removeLocalCover(existingProject?.coverImage ?? null);
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true, message: "Project saved." };
}

export async function deleteProject(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    const project = await prisma.project.findUnique({ where: { id }, select: { coverImage: true } });
    if (!project) return;
    await prisma.project.delete({ where: { id } });
    await removeLocalCover(project.coverImage);
  } catch (error) {
    console.error("Unable to delete project", error);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
}