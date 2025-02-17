import { getBudynki } from "@/actions/budynki";
import { getSale } from "@/actions/sale";
import { BackButton } from "@/components/back-button";
import { AddSalaDialog } from "@/components/sale/add-sala-dialog";
import { DeleteSalaDialog } from "@/components/sale/delete-sala-dialog";
import { EditSalaDialog } from "@/components/sale/edit-sala-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPietroNumer } from "@/lib/utils";

export default async function SalePage() {
  const [sale, budynki] = await Promise.all([getSale(), getBudynki()]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <BackButton href="/" label="Wróć do strony głównej" />
          <h1 className="text-3xl font-bold mt-2">Lista sal</h1>
        </div>
        <AddSalaDialog budynki={budynki} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale</CardTitle>
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
