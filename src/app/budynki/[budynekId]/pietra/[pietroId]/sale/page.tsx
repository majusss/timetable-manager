import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { notFound } from "next/navigation";
import { EditSalaDialog } from "@/components/sale/edit-sala-dialog";
import { DeleteSalaDialog } from "@/components/sale/delete-sala-dialog";
import { getPietro } from "@/actions/pietra";
import { createSala } from "@/actions/sale";

type Props = {
  params: Promise<{
    budynekId: string;
    pietroId: string;
  }>;
};

export default async function PietroSalePage({ params }: Props) {
  const pietro = await getPietro((await params).pietroId);
  if (!pietro) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton
          href={`/budynki/${(await params).budynekId}/pietra`}
          label={`Wróć do pięter budynku ${pietro.budynek.nazwa}`}
        />
        <h1 className="text-3xl font-bold mt-2">
          Sale na piętrze {pietro.numer}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj salę</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSala} className="space-y-4">
            <input type="hidden" name="pietroId" value={pietro.id} />
            <div>
              <label className="block text-sm font-medium">Nazwa sali</label>
              <input
                type="text"
                name="nazwa"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Liczba miejsc</label>
              <input
                type="number"
                name="liczbaMiejsc"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <Button type="submit">Dodaj salę</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista sal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pietro.sale.map((sala) => (
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
                <EditSalaDialog sala={sala} />
                <DeleteSalaDialog sala={sala} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
