"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPrzedmiot(
  nazwa: string,
  waga: number,
  typSalaPrzedmiotId?: string,
) {
  const finalTypId =
    typSalaPrzedmiotId ||
    (
      await db.typSalaPrzedmiot.findFirstOrThrow({
        where: { nazwa: "Ogólny" },
      })
    ).id;

  await db.przedmiot.create({
    data: {
      nazwa,
      waga,
      typSalaPrzedmiotId: finalTypId,
    },
  });

  revalidatePath("/dane/przedmioty");
}

export async function getPrzedmioty() {
  return await db.przedmiot.findMany({
    include: { nauczyciele: true, typSalaPrzedmiot: true },
  });
}

export async function updatePrzedmiot(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const waga = parseInt(formData.get("waga") as string);
  const typSalaPrzedmiotId = formData.get("typSalaPrzedmiotId") as string;

  await db.przedmiot.update({
    where: { id },
    data: {
      nazwa,
      waga,
      typSalaPrzedmiotId,
    },
  });

  revalidatePath("/dane/przedmioty");
}

export async function deletePrzedmiot(id: string) {
  await db.przedmiot.delete({ where: { id } });
  revalidatePath("/dane/przedmioty");
}

export async function getPrzedmiotGodziny(przedmiotId: string) {
  const godziny = await db.przedmiotOddzial.findMany({
    where: { przedmiotId },
    include: {
      oddzial: { select: { nazwa: true } },
    },
  });

  return godziny;
}
