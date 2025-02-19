import { getBudynki } from "@/actions/budynki";
import { BackButton } from "@/components/dane/back-button";
import { DeleteBudynekDialog } from "@/components/dane/budynki/delete-budynek-dialog";
import { EditBudynekDialog } from "@/components/dane/budynki/edit-budynek-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BudynekForm } from "./components/budynek-form";

export default async function BudynkiPage() {
  const budynki = await getBudynki();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton href="/dane" label="Wróć do strony głównej" />
        <h1 className="text-3xl font-bold mt-2">Zarządzanie Budynkami</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj budynek</CardTitle>
        </CardHeader>
        <CardContent>
          <BudynekForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista budynków</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budynki.map((budynek) => (
            <div
              key={budynek.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <span className="font-medium">{budynek.nazwa}</span>
                <div className="text-sm text-muted-foreground">
                  Liczba pięter: {budynek.pietra.length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dane/budynki/${budynek.id}/pietra`}>
                  <Button variant="outline" size="sm">
                    Zarządzaj piętrami
                  </Button>
                </Link>
                <EditBudynekDialog budynek={budynek} />
                <DeleteBudynekDialog budynek={budynek} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
