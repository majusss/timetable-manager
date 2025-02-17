"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSala(formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const liczbaMiejsc = parseInt(formData.get("liczbaMiejsc") as string);
  const pietroId = formData.get("pietroId") as string;

  const pietro = await db.pietro.findUnique({
    where: { id: pietroId },
    select: { budynekId: true },
  });

  await db.sala.create({
    data: {
      nazwa,
      liczbaMiejsc,
      pietroId,
    },
  });

  revalidatePath(`/budynki/${pietro?.budynekId}/pietra/${pietroId}/sale`);
}

export async function getSale() {
  return await db.sala.findMany({
    include: { pietro: { include: { budynek: true } } },
  });
}

export async function updateSala(id: string, formData: FormData) {
  const nazwa = formData.get("nazwa") as string;
  const liczbaMiejsc = parseInt(formData.get("liczbaMiejsc") as string);

  const sala = await db.sala.findUnique({
    where: { id },
    select: {
      pietroId: true,
      pietro: { select: { budynekId: true } },
    },
  });

  await db.sala.update({
    where: { id },
    data: {
      nazwa,
      liczbaMiejsc,
    },
  });

  revalidatePath(
    `/budynki/${sala?.pietro.budynekId}/pietra/${sala?.pietroId}/sale`
  );
}

export async function deleteSala(id: string) {
  const sala = await db.sala.findUnique({
    where: { id },
    select: {
      pietroId: true,
      pietro: { select: { budynekId: true } },
    },
  });
  await db.sala.delete({ where: { id } });
  revalidatePath(
    `/budynki/${sala?.pietro.budynekId}/pietra/${sala?.pietroId}/sale`
  );
}
