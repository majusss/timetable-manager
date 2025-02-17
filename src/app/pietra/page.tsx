import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PietroForm } from "./components/pietro-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBudynki } from "@/actions/budynki";
import { getPietra } from "@/actions/pietra";

export default async function PietraPage() {
  const [budynki, pietra] = await Promise.all([getBudynki(), getPietra()]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Zarządzanie Piętrami</h1>
        <Link href="/budynki">
          <Button variant="outline">Zarządzaj Budynkami</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie Piętrami</CardTitle>
        </CardHeader>
        <CardContent>
          <PietroForm budynki={budynki} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista pięter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pietra.map((pietro) => (
            <div
              key={pietro.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">Piętro {pietro.numer}</div>
                <div className="text-sm text-muted-foreground">
                  w budynku {pietro.budynek.nazwa}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                Liczba sal: {pietro.sale.length}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
