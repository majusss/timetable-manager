"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTypSali(nazwa: string) {
  await db.typSalaPrzedmiot.create({
    data: { nazwa },
  });

  revalidatePath("/dane/typy-sal");
}

export async function getTypySal() {
  return await db.typSalaPrzedmiot.findMany({
    include: {
      _count: {
        select: {
          sale: true,
          przedmioty: true,
        },
      },
    },
  });
}

export async function updateTypSali(id: string, nazwa: string) {
  await db.typSalaPrzedmiot.update({
    where: { id },
    data: { nazwa },
  });

  revalidatePath("/dane/typy-sal");
}

export async function deleteTypSali(id: string) {
  await db.typSalaPrzedmiot.delete({
    where: { id },
  });

  revalidatePath("/dane/typy-sal");
}
