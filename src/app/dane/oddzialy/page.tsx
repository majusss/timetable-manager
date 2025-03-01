import { getOddzialy } from "@/actions/oddzialy";
import { BackButton } from "@/components/dane/back-button";
import { DeleteOddzialDialog } from "@/components/dane/oddzialy/delete-oddzial-dialog";
import { EditOddzialDialog } from "@/components/dane/oddzialy/edit-oddzial-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OddzialForm } from "./components/oddzial-form";

export default async function OddzialyPage() {
  const oddzialy = await getOddzialy();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton href="/dane" label="Wróć do strony głównej" />
        <h1 className="text-3xl font-bold mt-2">Zarządzanie Oddziałami</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj oddział</CardTitle>
        </CardHeader>
        <CardContent>
          <OddzialForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista oddziałów</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {oddzialy.map((oddzial) => (
            <div
              key={oddzial.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{oddzial.nazwa}</div>
                <div className="text-sm text-muted-foreground">
                  {/* TODO: FANCY DISPLAY STATS */}
                  {/* Liczba lekcji w tygodniu: {oddzial.liczbaLekcjiTygodnia} */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditOddzialDialog oddzial={oddzial} />
                <DeleteOddzialDialog oddzial={oddzial} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
