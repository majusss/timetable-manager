import { getTypySal } from "@/actions/typySal";
import { BackButton } from "@/components/dane/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteTypSaliDialog } from "./components/delete-typ-sali-dialog";
import { EditTypSaliDialog } from "./components/edit-typ-sali-dialog";
import { TypSaliForm } from "./components/typ-sali-form";

export default async function TypySalPage() {
  const typySal = await getTypySal();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <BackButton href="/dane" label="Wróć do strony głównej" />
        <h1 className="text-3xl font-bold mt-2">Zarządzanie Typami Sal</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dodaj typ sali</CardTitle>
        </CardHeader>
        <CardContent>
          <TypSaliForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista typów sal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {typySal.map((typ) => (
            <div
              key={typ.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="font-medium">{typ.nazwa}</div>
                <div className="text-sm text-muted-foreground">
                  Sale: {typ._count.sale}, Przedmioty: {typ._count.przedmioty}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditTypSaliDialog typ={typ} />
                <DeleteTypSaliDialog typ={typ} />
              </div>
            </div>
          ))}
          {typySal.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Brak typów sal
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
