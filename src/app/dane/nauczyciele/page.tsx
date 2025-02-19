import { getNauczyciele } from "@/actions/nauczyciele";
import { getPrzedmioty } from "@/actions/przedmioty";
import { BackButton } from "@/components/dane/back-button";
import { DeleteNauczycielDialog } from "@/components/dane/nauczyciele/delete-nauczyciel-dialog";
import { EditNauczycielDialog } from "@/components/dane/nauczyciele/edit-nauczyciel-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { NauczycielForm } from "./components/nauczyciel-form";

export default async function NauczycieleStrona() {
  const [nauczyciele, przedmioty] = await Promise.all([
    getNauczyciele(),
    getPrzedmioty(),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton href="/dane" label="Wróć do strony głównej" />
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-3xl font-bold">Zarządzanie Nauczycielami</h1>
          <Link href="/dane/przedmioty">
            <Button variant="outline">Zarządzaj Przedmiotami</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj nauczyciela</CardTitle>
        </CardHeader>
        <CardContent>
          <NauczycielForm przedmioty={przedmioty} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista nauczycieli</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {nauczyciele.map((nauczyciel) => (
            <div
              key={nauczyciel.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{nauczyciel.nazwa}</div>
                <div className="text-sm text-muted-foreground">
                  Skrót: {nauczyciel.skrot}
                </div>
                <div className="text-sm text-muted-foreground">
                  Przedmioty:{" "}
                  {nauczyciel.przedmioty
                    .map((przedmiot) => przedmiot.nazwa)
                    .join(", ")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditNauczycielDialog
                  nauczyciel={nauczyciel}
                  przedmioty={przedmioty}
                />
                <DeleteNauczycielDialog nauczyciel={nauczyciel} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
