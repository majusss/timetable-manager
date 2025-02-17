"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSala({
  nazwa,
  liczbaMiejsc,
  pietroId,
}: {
  nazwa: string;
  liczbaMiejsc: number;
  pietroId: string;
}) {
  await db.sala.create({
    data: {
      nazwa,
      liczbaMiejsc,
      pietroId,
    },
  });

  const pietro = await db.pietro.findUnique({
    where: { id: pietroId },
    select: { budynekId: true },
  });

  revalidatePath(`/budynki/${pietro?.budynekId}/pietra/${pietroId}/sale`);
}

export async function getSale() {
  return await db.sala.findMany({
    include: { pietro: { include: { budynek: true } } },
  });
}

export async function updateSala(
  id: string,
  {
    nazwa,
    liczbaMiejsc,
    pietroId,
  }: {
    nazwa: string;
    liczbaMiejsc: number;
    pietroId: string;
  }
) {
  const sala = await db.sala.findUnique({
    where: { id },
    select: { pietro: { select: { budynekId: true } } },
  });

  await db.sala.update({
    where: { id },
    data: {
      nazwa,
      liczbaMiejsc,
      pietroId,
    },
  });

  revalidatePath(`/budynki/${sala?.pietro.budynekId}/pietra/${pietroId}/sale`);
}

export async function deleteSala(id: string) {
  const sala = await db.sala.findUnique({
    where: { id },
    select: { pietro: { select: { budynekId: true } }, pietroId: true },
  });

  await db.sala.delete({ where: { id } });

  revalidatePath(`/budynki/${sala?.pietro.budynekId}/pietra/${sala?.pietroId}/sale`);
}
