"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPietro(numer: number, budynekId: string) {
  await db.pietro.create({
    data: { numer, budynekId },
  });

  revalidatePath(`/budynki/${budynekId}/pietra`);
}

export async function getPietra() {
  return await db.pietro.findMany({
    include: {
      budynek: {
        include: {
          pietra: true,
        },
      },
      sale: true,
    },
  });
}

export async function getPietro(id: string) {
  return await db.pietro.findUnique({
    where: { id },
    include: {
      budynek: true,
      sale: {
        include: {
          pietro: {
            include: {
              budynek: true,
            },
          },
        },
      },
    },
  });
}

export async function updatePietro(id: string, formData: FormData) {
  const numer = parseInt(formData.get("numer") as string);

  const pietro = await db.pietro.findUnique({
    where: { id },
    select: { budynekId: true },
  });

  await db.pietro.update({
    where: { id },
    data: { numer },
  });

  revalidatePath(`/budynki/${pietro?.budynekId}/pietra`);
}

export async function deletePietro(id: string) {
  const pietro = await db.pietro.findUnique({
    where: { id },
    select: { budynekId: true },
  });
  await db.pietro.delete({ where: { id } });
  revalidatePath(`/budynki/${pietro?.budynekId}/pietra`);
}
