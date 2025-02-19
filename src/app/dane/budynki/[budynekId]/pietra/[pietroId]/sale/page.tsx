import { getBudynki } from "@/actions/budynki";
import { getPietro } from "@/actions/pietra";
import { BackButton } from "@/components/dane/back-button";
import { DeleteSalaDialog } from "@/components/dane/sale/delete-sala-dialog";
import { EditSalaDialog } from "@/components/dane/sale/edit-sala-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPietroNumer } from "@/lib/utils";
import { Sala } from "@/types";
import { notFound } from "next/navigation";
import { SalaForm } from "./components/sala-form";

interface Props {
  params: Promise<{
    budynekId: string;
    pietroId: string;
  }>;
}

export default async function PietroSalePage({ params }: Props) {
  const [pietro, budynki] = await Promise.all([
    getPietro((await params).pietroId),
    getBudynki(),
  ]);

  if (!pietro) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton
          href={`/dane/budynki/${(await params).budynekId}/pietra`}
          label={`Wróć do pięter budynku ${pietro.budynek.nazwa}`}
        />
        <h1 className="text-3xl font-bold mt-2">
          Sale na piętrze {formatPietroNumer(pietro.numer)}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj salę</CardTitle>
        </CardHeader>
        <CardContent>
          <SalaForm pietroId={pietro.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista sal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pietro.sale.map((sala: Sala) => (
            <div
              key={sala.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{sala.nazwa}</div>
                <div className="text-sm text-muted-foreground">
                  Liczba miejsc: {sala.liczbaMiejsc}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditSalaDialog sala={sala} budynki={budynki} />
                <DeleteSalaDialog sala={sala} />
              </div>
            </div>
          ))}
          {pietro.sale.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Brak sal na tym piętrze
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
