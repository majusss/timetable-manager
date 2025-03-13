import { getBudynki } from "@/actions/budynki";
import { getSale } from "@/actions/sale";
import { BackButton } from "@/components/dane/back-button";
import { DeleteSalaDialog } from "@/components/dane/sale/delete-sala-dialog";
import { EditSalaDialog } from "@/components/dane/sale/edit-sala-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPietroNumer } from "@/lib/utils";
import Link from "next/link";
import { SalaForm } from "./components/sala-form";

export default async function SalePage() {
  const [sale, budynki] = await Promise.all([getSale(), getBudynki()]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton href="/dane" label="Wróć do strony głównej" />
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-3xl font-bold">Zarządzanie Salami</h1>
          <Link href="/dane/typy-sal">
            <Button variant="outline">Zarządzaj Typami Sal</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj salę</CardTitle>
        </CardHeader>
        <CardContent>
          <SalaForm budynki={budynki} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista sal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sale.map((sala) => (
            <div
              key={sala.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{sala.nazwa}</div>
                <div className="text-sm text-muted-foreground">
                  Liczba miejsc: {sala.liczbaMiejsc}
                </div>
                <div className="text-sm text-muted-foreground">
                  Lokalizacja: {sala.pietro.budynek.nazwa},{" "}
                  {formatPietroNumer(sala.pietro.numer)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Typ sali: {sala.typSalaPrzedmiot?.nazwa || "Ogólny"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditSalaDialog sala={sala} budynki={budynki} />
                <DeleteSalaDialog sala={sala} />
              </div>
            </div>
          ))}
          {sale.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Brak sal
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
