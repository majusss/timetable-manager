import { BackButton } from "@/components/dane/back-button";
import { DeletePrzedmiotDialog } from "@/components/dane/przedmioty/delete-przedmiot-dialog";
import { EditPrzedmiotDialog } from "@/components/dane/przedmioty/edit-przedmiot-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { PrzedmiotForm } from "./components/przedmiot-form";
import { PrzedmiotGodziny } from "./components/przedmiot-godziny";

export default async function PrzedmiotyPage() {
  const przedmioty = await db.przedmiot.findMany({
    include: {
      typSalaPrzedmiot: true,
    },
  });
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const isFromNauczyciele = referer.includes("/nauczyciele");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton
          href={isFromNauczyciele ? "/dane/nauczyciele" : "/dane"}
          label={
            isFromNauczyciele ? "Wróć do nauczycieli" : "Wróć do strony głównej"
          }
        />
        <h1 className="text-3xl font-bold mt-2">Zarządzanie Przedmiotami</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj przedmiot</CardTitle>
        </CardHeader>
        <CardContent>
          <PrzedmiotForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista przedmiotów</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {przedmioty.map((przedmiot) => (
            <div
              key={przedmiot.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{przedmiot.nazwa}</div>
                <div className="text-sm text-muted-foreground">
                  Waga: {przedmiot.waga}
                  <br />
                  Typ sali: {przedmiot.typSalaPrzedmiot.nazwa}
                </div>
                <PrzedmiotGodziny przedmiotId={przedmiot.id} />
              </div>
              <div className="flex items-center gap-2">
                <EditPrzedmiotDialog przedmiot={przedmiot} />
                <DeletePrzedmiotDialog przedmiot={przedmiot} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
