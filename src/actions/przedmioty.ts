"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPrzedmiot(formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const waga = parseInt(formData.get("waga") as string);

  await db.przedmiot.create({
    data: { nazwa, waga },
  });

  revalidatePath("/przedmioty");
}

export async function getPrzedmioty() {
  return await db.przedmiot.findMany({
    include: { nauczyciele: true },
  });
}

export async function updatePrzedmiot(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const waga = parseInt(formData.get("waga") as string);

  await db.przedmiot.update({
    where: { id },
    data: { nazwa, waga },
  });

  revalidatePath("/przedmioty");
}

export async function deletePrzedmiot(id: string) {
  await db.przedmiot.delete({ where: { id } });
  revalidatePath("/przedmioty");
}
