"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBudynek(formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  await db.budynek.create({ data: { nazwa } });
  revalidatePath("/budynki");
}

export async function getBudynki() {
  return await db.budynek.findMany({
    include: {
      pietra: {
        include: {
          budynek: true,
          sale: true,
        },
      },
    },
  });
}

export async function getBudynek(id: string) {
  return await db.budynek.findUnique({
    where: { id },
    include: {
      pietra: {
        include: {
          sale: true,
        },
      },
    },
  });
}

export async function updateBudynek(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  await db.budynek.update({
    where: { id },
    data: { nazwa },
  });
  revalidatePath("/budynki");
}

export async function deleteBudynek(id: string) {
  await db.budynek.delete({ where: { id } });
  revalidatePath("/budynki");
}
