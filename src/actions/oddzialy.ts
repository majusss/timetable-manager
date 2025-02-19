"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createOddzial(
  nazwa: string,
  liczbaLekcjiTygodnia: number,
) {
  await db.oddzial.create({
    data: {
      nazwa,
      liczbaLekcjiTygodnia,
    },
  });

  revalidatePath("/dane/oddzialy");
}

export async function getOddzialy() {
  return await db.oddzial.findMany();
}

export async function updateOddzial(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const liczbaLekcjiTygodnia = parseInt(
    formData.get("liczbaLekcjiTygodnia") as string,
  );

  await db.oddzial.update({
    where: { id },
    data: { nazwa, liczbaLekcjiTygodnia },
  });

  revalidatePath("/dane/oddzialy");
}

export async function deleteOddzial(id: string) {
  await db.oddzial.delete({ where: { id } });
  revalidatePath("/dane/oddzialy");
}
