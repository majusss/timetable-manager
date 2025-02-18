import { getBudynek } from "@/actions/budynki";
import { createPietro } from "@/actions/pietra";
import { BackButton } from "@/components/back-button";
import { DeletePietroDialog } from "@/components/pietra/delete-pietro-dialog";
import { EditPietroDialog } from "@/components/pietra/edit-pietro-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPietroNumer } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BudynekPietraPage({
  params,
}: {
  params: Promise<{ budynekId: string }>;
}) {
  const budynek = await getBudynek((await params).budynekId);
  if (!budynek) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <BackButton href="/budynki" label="Wróć do budynków" />
          <h1 className="text-3xl font-bold mt-2">
            Piętra budynku {budynek.nazwa}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj piętro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPietro} className="space-y-4">
            <Input type="hidden" name="budynekId" value={budynek.id} />
            <div>
              <label className="block text-sm font-medium">Numer piętra</label>
              <Input
                type="number"
                name="numer"
                placeholder="Wprowadź numer piętra"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <Button type="submit">Dodaj piętro</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista pięter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budynek.pietra.length > 0 ? (
            budynek.pietra.map((pietro) => (
              <div
                key={pietro.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {formatPietroNumer(pietro.numer)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Liczba sal: {pietro.sale.length}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/budynki/${budynek.id}/pietra/${pietro.id}/sale`}
                  >
                    <Button variant="outline" size="sm">
                      Zarządzaj salami
                    </Button>
                  </Link>
                  <EditPietroDialog pietro={pietro} />
                  <DeletePietroDialog pietro={pietro} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Brak pięter
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
