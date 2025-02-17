"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createNauczyciel(formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const skrot = formData.get("skrot") as string;
  const przedmiotyIds = formData.getAll("przedmioty") as string[];

  await db.nauczyciel.create({
    data: {
      nazwa,
      skrot,
      przedmioty: {
        connect: przedmiotyIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/nauczyciele");
}

export async function getNauczyciele() {
  return await db.nauczyciel.findMany({
    include: { przedmioty: true },
  });
}

export async function updateNauczyciel(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const skrot = formData.get("skrot") as string;
  const przedmiotyIds = formData.getAll("przedmioty") as string[];

  await db.nauczyciel.update({
    where: { id },
    data: {
      nazwa,
      skrot,
      przedmioty: {
        set: przedmiotyIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/nauczyciele");
}

export async function deleteNauczyciel(id: string) {
  await db.nauczyciel.delete({ where: { id } });
  revalidatePath("/nauczyciele");
}
