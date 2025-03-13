"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSala({
  nazwa,
  liczbaMiejsc,
  pietroId,
  typSalaPrzedmiotId,
}: {
  nazwa: string;
  liczbaMiejsc: number;
  pietroId: string;
  typSalaPrzedmiotId?: string;
}) {
  const finalTypId =
    typSalaPrzedmiotId ||
    (
      await db.typSalaPrzedmiot.findFirstOrThrow({
        where: { nazwa: "Ogólny" },
      })
    ).id;

  await db.sala.create({
    data: {
      nazwa,
      liczbaMiejsc,
      pietroId,
      typSalaPrzedmiotId: finalTypId,
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
    include: {
      pietro: { include: { budynek: true } },
      typSalaPrzedmiot: true,
    },
  });
}

export async function updateSala(
  id: string,
  {
    nazwa,
    liczbaMiejsc,
    pietroId,
    typSalaPrzedmiotId,
  }: {
    nazwa: string;
    liczbaMiejsc: number;
    pietroId: string;
    typSalaPrzedmiotId?: string;
  },
) {
  const sala = await db.sala.findUnique({
    where: { id },
    select: { pietro: { select: { budynekId: true } } },
  });

  const finalTypId =
    typSalaPrzedmiotId ||
    (
      await db.typSalaPrzedmiot.findFirstOrThrow({
        where: { nazwa: "Ogólny" },
      })
    ).id;

  await db.sala.update({
    where: { id },
    data: {
      nazwa,
      liczbaMiejsc,
      pietroId,
      typSalaPrzedmiotId: finalTypId,
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

  revalidatePath(
    `/budynki/${sala?.pietro.budynekId}/pietra/${sala?.pietroId}/sale`,
  );
}
