"use server";

import { db } from "@/lib/db";
import { Table, Timetable, TimetableList } from "@majusss/timetable-parser";
import { revalidatePath } from "next/cache";

export async function getDataToImport(url: string) {
  try {
    const fetchUrl = new URL(url);
    const response = await fetch(fetchUrl.href, {
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error("Nie udało się pobrać planu lekcji");
    }
    const html = await response.text();

    const timetable = new Timetable(html);
    const title = timetable.getTitle();
    const listPath = timetable.getListPath();
    const listUrl = new URL(`${fetchUrl.href}/${listPath}`);

    const listResponse = await fetch(listUrl.href, {
      redirect: "follow",
    });
    if (!listResponse.ok) {
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

async function getLiczbaLekcjiTygodnia(url: string) {
  const fetchUrl = new URL(url);
  const response = await fetch(fetchUrl.href, {
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error("Nie udało się pobrać planu lekcji");
  }
  const html = await response.text();

  const table = new Table(html);
  const hours = await table.getDays();

  const firstGroupName = hours
    .flat()
    .find((lesson) => lesson.length > 1)?.[0].groupName;
  const lessons = hours.flat().filter((lesson) => {
    const isLessonEmpty = lesson.length === 0;
    if (isLessonEmpty) return false;

    const isGrupSlited = "groupName" in lesson[0];
    const isLessonForFirstGroup = lesson[0]?.groupName == firstGroupName;

    if (!isGrupSlited) return true;
    if (isGrupSlited && isLessonForFirstGroup) return true;
  });

  return lessons.length;
}

export async function addOddzial(name: string, url: string) {
  try {
    await db.oddzial.create({
      data: {
        nazwa: name,
        liczbaLekcjiTygodnia: await getLiczbaLekcjiTygodnia(url),
      },
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
    revalidatePath("/sale");
    revalidatePath(
      `/budynki/${config.pietroId}/pietra/${config.pietroId}/sale`,
    );

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
    revalidatePath("/nauczyciele");

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
