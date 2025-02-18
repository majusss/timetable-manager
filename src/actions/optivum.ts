"use server";

import { db } from "@/lib/db";
import { Timetable, TimetableList } from "@majusss/timetable-parser";
import { revalidatePath } from "next/cache";

export async function getDataToImport(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Nie udało się pobrać planu lekcji");
    }
    const html = await response.text();

    const timetable = new Timetable(html);
    const title = timetable.getTitle();
    const listPath = timetable.getListPath();

    const listResponse = await fetch(url + listPath);
    if (!response.ok) {
      throw new Error("Nie udało się pobrać planu lekcji");
    }

    const listHtml = await listResponse.text();
    const timetableList = new TimetableList(listHtml);
    const list = timetableList.getList();

    return { success: true, message: `Rozpoczęto import "${title}"`, list };
  } catch (error) {
    console.log("Błąd importu:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Nieznany błąd importu",
      list: {
        classes: [],
      },
    };
  }
}

export async function addOddzial(name: string) {
  try {
    const data = {
      nazwa: name,
      liczbaLekcjiTygodnia: 0,
    };

    await db.oddzial.create({
      data,
    });

    revalidatePath("/");
    revalidatePath("/oddzialy");

    return { success: true };
  } catch (error) {
    console.log("Błąd dodawania oddziału:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Nie udało się dodać oddziału",
    };
  }
}

export async function addSala(
  sala: { name: string },
  config: { liczbaMiejsc: string; pietroId: string },
) {
  try {
    await db.sala.create({
      data: {
        nazwa: sala.name,
        liczbaMiejsc: parseInt(config.liczbaMiejsc),
        pietroId: config.pietroId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Błąd dodawania sali:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Nie udało się dodać sali",
    };
  }
}

export async function addNauczyciel(nauczyciel: {
  name: string;
  short: string;
}) {
  try {
    await db.nauczyciel.create({
      data: {
        nazwa: nauczyciel.name,
        skrot: nauczyciel.short,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Błąd dodawania nauczyciela:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Nie udało się dodać nauczyciela",
    };
  }
}
