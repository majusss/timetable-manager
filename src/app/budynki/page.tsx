import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BudynekForm } from "./components/budynek-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { EditBudynekDialog } from "@/components/budynki/edit-budynek-dialog";
import { DeleteBudynekDialog } from "@/components/budynki/delete-budynek-dialog";
import { getBudynki } from "@/actions/budynki";

export default async function BudynkiPage() {
  const budynki = await getBudynki();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton href="/" label="Wróć do strony głównej" />
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
                <Link href={`/budynki/${budynek.id}/pietra`}>
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
