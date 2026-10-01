"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const messageStatuses = ["UNREAD", "READ", "REPLIED", "ARCHIVED"] as const;

export async function updateMessageStatus(id: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  const value = formData.get("status");
  if (typeof value !== "string" || !messageStatuses.includes(value as (typeof messageStatuses)[number])) return;

  try {
    await prisma.contactMessage.update({ where: { id }, data: { status: value as (typeof messageStatuses)[number] } });
  } catch (error) {
    console.error("Unable to update contact message status", error);
  }

  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: number, _formData: FormData) {
  void _formData;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!Number.isInteger(id) || id < 1) return;

  try {
    await prisma.contactMessage.delete({ where: { id } });
  } catch (error) {
    console.error("Unable to delete contact message", error);
  }

  revalidatePath("/admin/messages");
}