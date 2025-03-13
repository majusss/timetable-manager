"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function clearDatabase() {
  try {
    await db.sala.deleteMany();
    await db.pietro.deleteMany();
    await db.budynek.deleteMany({
      where: {
        NOT: {
          nazwa: "Główny",
        },
      },
    });
    await db.nauczyciel.deleteMany();
    await db.oddzial.deleteMany();
    await db.przedmiot.deleteMany();
    await db.typSalaPrzedmiot.deleteMany({
      where: {
        NOT: {
          nazwa: "Ogólny",
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/dane");
    revalidatePath("/dane/budynki");
    revalidatePath("/dane/typy-sal");
    revalidatePath("/dane/sale");
    revalidatePath("/dane/nauczyciele");
    revalidatePath("/dane/oddzialy");
    revalidatePath("/dane/przedmioty");

    return { success: true };
  } catch (error) {
    console.error("Błąd czyszczenia bazy:", error);
    return {
      success: false,
      error: "Nie udało się wyczyścić bazy danych",
    };
  }
}
