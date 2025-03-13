import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type WeekDay = "poniedzialek" | "wtorek" | "sroda" | "czwartek" | "piatek";
const DAYS: WeekDay[] = [
  "poniedzialek",
  "wtorek",
  "sroda",
  "czwartek",
  "piatek",
];

type ScheduleSlot = {
  przedmiot: string;
  nauczyciel: string;
  sala: string;
  godzina: number;
};

type ClassSchedule = {
  [key in WeekDay]: ScheduleSlot[];
};

// Definicje typów dla zapytań
const oddzialInclude = {
  przedmiotyOddzial: {
    include: {
      przedmiot: true,
    },
  },
} satisfies Prisma.OddzialInclude;

const przedmiotInclude = {
  przedmiot: {
    include: {
      typSalaPrzedmiot: true,
    },
  },
  oddzial: true,
} satisfies Prisma.PrzedmiotOddzialInclude;

const nauczycielInclude = {
  przedmioty: true,
} satisfies Prisma.NauczycielInclude;

const salaInclude = {
  pietro: {
    include: {
      budynek: true,
    },
  },
  typSalaPrzedmiot: true,
} satisfies Prisma.SalaInclude;

type OddzialResult = Prisma.OddzialGetPayload<{
  include: typeof oddzialInclude;
}>;

type PrzedmiotOddzialResult = Prisma.PrzedmiotOddzialGetPayload<{
  include: typeof przedmiotInclude;
}>;

type NauczycielResult = Prisma.NauczycielGetPayload<{
  include: typeof nauczycielInclude;
}>;

type SalaResult = Prisma.SalaGetPayload<{
  include: typeof salaInclude;
}>;

export class TimetableGenerator {
  private teacherAvailability: Map<string, Set<string>> = new Map();
  private roomAvailability: Map<string, Set<string>> = new Map();

  async generate(): Promise<Record<string, ClassSchedule>> {
    const [oddzialy, przedmiotyOddzial, nauczyciele, sale] =
      await this.fetchData();
    const timetable: Record<string, ClassSchedule> = {};

    for (const oddzial of oddzialy) {
      let success = false;
      let attempts = 0;
      const maxAttempts = 5;

      while (!success && attempts < maxAttempts) {
        try {
          const schedule = await this.createContinuousSchedule(
            oddzial,
            przedmiotyOddzial.filter((po) => po.oddzialId === oddzial.id),
            nauczyciele,
            sale,
          );
          timetable[oddzial.id] = schedule;
          success = true;
        } catch (error) {
          console.error(`Error while generating timetable: ${error}`);
          attempts++;
          this.resetAvailability();
          if (attempts === maxAttempts) {
            throw new Error(
              `Nie udało się utworzyć planu dla oddziału ${oddzial.id} po ${maxAttempts} próbach`,
            );
          }
        }
      }
    }

    return this.makeTimeTableDisplay(
      timetable,
      oddzialy,
      przedmiotyOddzial,
      nauczyciele,
      sale,
    );
  }

  private async makeTimeTableDisplay(
    timetable: Record<string, ClassSchedule>,
    oddzialy: OddzialResult[],
    przedmiotyOddzial: PrzedmiotOddzialResult[],
    nauczyciele: NauczycielResult[],
    sale: SalaResult[],
  ) {
    const oddzialyMap = Object.fromEntries(
      oddzialy.map((oddzial) => [oddzial.id, oddzial]),
    );
    const przedmiotyMap = Object.fromEntries(
      przedmiotyOddzial.map((po) => [po.przedmiotId, po]),
    );
    const nauczycieleMap = Object.fromEntries(
      nauczyciele.map((n) => [n.id, n]),
    );
    const saleMap = Object.fromEntries(sale.map((s) => [s.id, s]));

    // todo: naprawic typy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedDisplay: Record<string, any> = {};

    for (const [id, lessons] of Object.entries(timetable)) {
      const oddzialId = id;
      const oddzial = oddzialyMap[oddzialId];
      const oddzialName = oddzial.nazwa;
      const lessonsDisplay = Object.fromEntries(
        Object.entries(lessons).map(([day, slots]) => [
          day,
          slots.map((slot) => {
            const przedmiotObj = przedmiotyMap[slot.przedmiot];
            if (!przedmiotObj || !przedmiotObj.przedmiot) {
              throw new Error(
                `Missing przedmiot data for ID: ${slot.przedmiot}`,
              );
            }
            return {
              przedmiot: przedmiotObj.przedmiot.nazwa,
              nauczyciel: nauczycieleMap[slot.nauczyciel]?.nazwa ?? "Unknown",
              sala: saleMap[slot.sala]?.nazwa ?? "Unknown",
              godzina: slot.godzina,
            };
          }),
        ]),
      );

      formattedDisplay[oddzialName] = lessonsDisplay;
    }

    return formattedDisplay;
  }

  private async fetchData() {
    return Promise.all([
      prisma.oddzial.findMany({ include: oddzialInclude }),
      prisma.przedmiotOddzial.findMany({ include: przedmiotInclude }),
      prisma.nauczyciel.findMany({ include: nauczycielInclude }),
      prisma.sala.findMany({ include: salaInclude }),
    ]);
  }

  private createContinuousSchedule(
    oddzial: OddzialResult,
    przedmioty: PrzedmiotOddzialResult[],
    nauczyciele: NauczycielResult[],
    sale: SalaResult[],
  ): ClassSchedule {
    const schedule: ClassSchedule = Object.fromEntries(
      DAYS.map((day) => [day, [] as ScheduleSlot[]]),
    ) as ClassSchedule;

    const dailyLessons = this.distributeLessons(przedmioty);

    for (const day of DAYS) {
      const dayLessons = dailyLessons[day];
      let currentHour = 8;
      let backtrackCount = 0;
      const maxBacktrack = 3;

      for (let i = 0; i < dayLessons.length; i++) {
        const lesson = dayLessons[i];
        let scheduled = false;

        while (!scheduled && backtrackCount < maxBacktrack) {
          try {
            const slot = this.scheduleSingleLesson(
              lesson,
              day,
              currentHour,
              nauczyciele,
              sale,
            );

            schedule[day].push(slot);
            this.updateAvailability(slot, day);
            scheduled = true;
            currentHour++;
          } catch (error) {
            console.error(`Error while scheduling lesson: ${error}`);
            // Cofnij się i spróbuj przeplanować poprzednie lekcje
            if (i > 0) {
              const previousSlot = schedule[day].pop()!;
              this.removeAvailability(previousSlot, day);
              i--;
              currentHour--;
              backtrackCount++;
            } else {
              throw new Error(`Nie można zaplanować lekcji dla ${oddzial.id}`);
            }
          }
        }

        if (!scheduled) {
          throw new Error(
            `Przekroczono limit prób przeplanowania dla ${oddzial.id}`,
          );
        }
      }
    }

    return schedule;
  }

  private scheduleSingleLesson(
    lesson: PrzedmiotOddzialResult,
    day: WeekDay,
    hour: number,
    nauczyciele: NauczycielResult[],
    sale: SalaResult[],
  ): ScheduleSlot {
    const timeSlot = `${day}_${hour}`;

    // Znajdź dostępnego nauczyciela
    const availableTeacher = this.findAvailableTeacher(
      lesson,
      timeSlot,
      nauczyciele,
    );
    if (!availableTeacher) {
      throw new Error("Brak dostępnego nauczyciela");
    }

    // Znajdź dostępną salę zgodną z typem przedmiotu
    const availableRoom = this.findAvailableRoom(timeSlot, sale, lesson);
    if (!availableRoom) {
      throw new Error(
        `Brak dostępnej sali typu ${lesson.przedmiot.typSalaPrzedmiotId} dla przedmiotu ${lesson.przedmiot.nazwa}`,
      );
    }

    return {
      przedmiot: lesson.przedmiotId,
      nauczyciel: availableTeacher.id,
      sala: availableRoom.id,
      godzina: hour,
    };
  }

  private findAvailableTeacher(
    lesson: PrzedmiotOddzialResult,
    timeSlot: string,
    nauczyciele: NauczycielResult[],
  ): NauczycielResult | null {
    return (
      nauczyciele.find(
        (n) =>
          n.przedmioty.some((p) => p.id === lesson.przedmiotId) &&
          !this.teacherAvailability.get(n.id)?.has(timeSlot),
      ) || null
    );
  }

  private findAvailableRoom(
    timeSlot: string,
    sale: SalaResult[],
    lesson: PrzedmiotOddzialResult,
  ): SalaResult | null {
    return (
      sale.find(
        (s) =>
          !this.roomAvailability.get(s.id)?.has(timeSlot) &&
          s.typSalaPrzedmiotId === lesson.przedmiot.typSalaPrzedmiotId,
      ) || null
    );
  }

  private updateAvailability(slot: ScheduleSlot, day: WeekDay) {
    const timeSlot = `${day}_${slot.godzina}`;

    if (!this.teacherAvailability.has(slot.nauczyciel)) {
      this.teacherAvailability.set(slot.nauczyciel, new Set());
    }
    this.teacherAvailability.get(slot.nauczyciel)!.add(timeSlot);

    if (!this.roomAvailability.has(slot.sala)) {
      this.roomAvailability.set(slot.sala, new Set());
    }
    this.roomAvailability.get(slot.sala)!.add(timeSlot);
  }

  private removeAvailability(slot: ScheduleSlot, day: WeekDay) {
    const timeSlot = `${day}_${slot.godzina}`;
    this.teacherAvailability.get(slot.nauczyciel)?.delete(timeSlot);
    this.roomAvailability.get(slot.sala)?.delete(timeSlot);
  }

  private resetAvailability() {
    this.teacherAvailability.clear();
    this.roomAvailability.clear();
  }

  private distributeLessons(
    przedmioty: PrzedmiotOddzialResult[],
  ): Record<WeekDay, PrzedmiotOddzialResult[]> {
    const distribution: Record<WeekDay, PrzedmiotOddzialResult[]> = {
      poniedzialek: [],
      wtorek: [],
      sroda: [],
      czwartek: [],
      piatek: [],
    };

    // 1. Oblicz całkowitą liczbę godzin w tygodniu
    const totalHours = przedmioty.reduce((sum, p) => sum + p.godzTygodnia, 0);

    // 2. Oblicz optymalną liczbę godzin na dzień
    const targetHoursPerDay = Math.ceil(totalHours / DAYS.length);

    // 3. Sortuj przedmioty według liczby godzin (malejąco)
    const sortedPrzedmioty = [...przedmioty].sort(
      (a, b) => b.godzTygodnia - a.godzTygodnia,
    );

    // 4. Rozdziel godziny równomiernie
    let currentDay = 0;

    for (const przedmiot of sortedPrzedmioty) {
      let remainingHours = przedmiot.godzTygodnia;

      while (remainingHours > 0) {
        // Znajdź dzień z najmniejszą liczbą godzin
        const dayWithLeastHours = DAYS.reduce(
          (minDay, day) =>
            distribution[day].length < distribution[minDay].length
              ? day
              : minDay,
          DAYS[0],
        );

        // Sprawdź czy nie przekraczamy limitu godzin na dzień
        if (distribution[dayWithLeastHours].length < targetHoursPerDay) {
          distribution[dayWithLeastHours].push(przedmiot);
          remainingHours--;
        } else {
          // Jeśli wszystkie dni są pełne, zwiększ limit
          currentDay = (currentDay + 1) % DAYS.length;
        }
      }
    }

    // 5. Posortuj lekcje w każdym dniu według priorytetu przedmiotu
    for (const day of DAYS) {
      distribution[day].sort((a, b) => a.przedmiot.waga - b.przedmiot.waga);
    }

    return distribution;
  }
}
