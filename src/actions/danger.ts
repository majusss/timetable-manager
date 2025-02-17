"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function clearDatabase() {
  try {
    await db.sala.deleteMany();
    await db.pietro.deleteMany();
    await db.budynek.deleteMany();
    await db.nauczyciel.deleteMany();
    await db.oddzial.deleteMany();
    await db.przedmiot.deleteMany();

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Błąd czyszczenia bazy:", error);
    return {
      success: false,
      error: "Nie udało się wyczyścić bazy danych",
    };
  }
}
