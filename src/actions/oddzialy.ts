"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createOddzial(nazwa: string) {
  await db.oddzial.create({
    data: {
      nazwa,
    },
  });

  revalidatePath("/dane/oddzialy");
}

export async function getOddzialy() {
  return await db.oddzial.findMany();
}

export async function updateOddzial(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;

  await db.oddzial.update({
    where: { id },
    data: { nazwa },
  });

  revalidatePath("/dane/oddzialy");
}

export async function deleteOddzial(id: string) {
  await db.oddzial.delete({ where: { id } });
  revalidatePath("/dane/oddzialy");
}
