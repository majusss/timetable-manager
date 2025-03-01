"use server";

import { db } from "@/lib/db";
import {
  Table,
  TableLesson,
  Timetable,
  TimetableList,
} from "@majusss/timetable-parser";
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
    console.error("Błąd importu:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Nieznany błąd importu",
      list: {
        classes: [],
      },
    };
  }
}

async function getMostUsedGroupName(hours: TableLesson[][][]) {
  const groupNames = hours
    .flat()
    .flat()
    .filter(
      (lesson): lesson is TableLesson =>
        lesson !== undefined && lesson !== null,
    )
    .map((lesson) => lesson.groupName)
    .filter((name): name is string => name !== undefined && name !== null);

  if (groupNames.length === 0) {
    return "";
  }

  const groupNameCounts = groupNames.reduce(
    (acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedGroups = Object.entries(groupNameCounts).sort(
    (a, b) => b[1] - a[1],
  );
  return sortedGroups.length > 0 ? sortedGroups[0][0] : "";
}

export async function addOddzial(name: string) {
  try {
    await db.oddzial.create({
      data: {
        nazwa: name,
      },
    });

    revalidatePath("/dane/");
    revalidatePath("/dane/oddzialy");

    return { success: true };
  } catch (error) {
    console.error("Błąd dodawania oddziału:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Nie udało się dodać oddziału",
    };
  }
}

export async function addSala(
  name: string,
  config: { liczbaMiejsc: string; pietroId: string },
) {
  try {
    await db.sala.create({
      data: {
        nazwa: name,
        liczbaMiejsc: parseInt(config.liczbaMiejsc),
        pietroId: config.pietroId,
      },
    });

    revalidatePath("/dane/");
    revalidatePath("/dane/sale");
    revalidatePath(
      `/budynki/${config.pietroId}/pietra/${config.pietroId}/sale`,
    );

    return { success: true };
  } catch (error) {
    console.error("Błąd dodawania sali:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Nie udało się dodać sali",
    };
  }
}

async function getPrzedmioty(
  url: string,
  defaultWaga: number,
): Promise<{
  przedmioty: {
    where: { nazwa: string };
    create: { nazwa: string; waga: number };
  }[];
  przedmiotyGodziny: {
    przedmiot: string;
    className: string;
    godzTygodnia: number;
  }[];
}> {
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

  const primaryGroupName = await getMostUsedGroupName(hours);

  const przedmiotyCount: Record<string, Record<string, number>> = {};

  hours.flat().forEach((lessons) => {
    if (!lessons || lessons.length === 0) return;

    const lesson = lessons[0];
    if (!lesson) return;

    const isGrupSlited = lesson.groupName !== undefined;
    const isLessonForFirstGroup =
      !isGrupSlited || lesson.groupName === primaryGroupName;

    if (isLessonForFirstGroup && lesson.subject && lesson.className) {
      if (!przedmiotyCount[lesson.subject]) {
        przedmiotyCount[lesson.subject] = {};
      }
      przedmiotyCount[lesson.subject][lesson.className] =
        (przedmiotyCount[lesson.subject][lesson.className] || 0) + 1;
    }
  });

  const przedmioty = Object.keys(przedmiotyCount).map((nazwa) => ({
    where: { nazwa },
    create: { nazwa, waga: defaultWaga },
  }));

  const przedmiotyGodziny = Object.entries(przedmiotyCount).flatMap(
    ([przedmiot, classes]) =>
      Object.entries(classes).map(([className, godziny]) => ({
        przedmiot,
        className,
        godzTygodnia: godziny,
      })),
  );

  return { przedmioty, przedmiotyGodziny };
}

export async function addNauczyciel(
  name: string,
  url: string,
  config: {
    skrotLength: number;
    przedmiotyWaga: number;
  },
) {
  try {
    const { przedmioty, przedmiotyGodziny } = await getPrzedmioty(
      url,
      config.przedmiotyWaga,
    );

    const nauczyciel = await db.nauczyciel.create({
      data: {
        nazwa: name,
        skrot: name.slice(0, config.skrotLength),
        przedmioty: {
          connectOrCreate: przedmioty,
        },
      },
      include: {
        przedmioty: true,
      },
    });

    for (const { przedmiot, className, godzTygodnia } of przedmiotyGodziny) {
      const dbPrzedmiot = nauczyciel.przedmioty.find(
        (p) => p.nazwa === przedmiot,
      );
      if (dbPrzedmiot) {
        const oddzial = await db.oddzial.findFirst({
          where: { nazwa: className },
        });

        if (oddzial) {
          await db.przedmiotOddzial.upsert({
            where: {
              przedmiotId_oddzialId: {
                przedmiotId: dbPrzedmiot.id,
                oddzialId: oddzial.id,
              },
            },
            create: {
              przedmiotId: dbPrzedmiot.id,
              oddzialId: oddzial.id,
              godzTygodnia,
            },
            update: {
              godzTygodnia,
            },
          });
        }
      }
    }

    revalidatePath("/dane/");
    revalidatePath("/dane/nauczyciele");

    return { success: true };
  } catch (error) {
    console.error("Błąd dodawania nauczyciela:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Nie udało się dodać nauczyciela",
    };
  }
}
