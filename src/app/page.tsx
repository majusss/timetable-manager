import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getBudynki } from "@/actions/budynki";
import { getNauczyciele } from "@/actions/nauczyciele";
import { getOddzialy } from "@/actions/oddzialy";
import { getPietra } from "@/actions/pietra";
import { getPrzedmioty } from "@/actions/przedmioty";
import { getSale } from "@/actions/sale";
import { DangerZone } from "@/components/danger-zone";
import { ImportDialog } from "@/components/import/import-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [budynki, pietra, sale, przedmioty, nauczyciele, oddzialy] =
    await Promise.all([
      getBudynki(),
      getPietra(),
      getSale(),
      getPrzedmioty(),
      getNauczyciele(),
      getOddzialy(),
    ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Panel zarządzania szkołą</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Budynki */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budynki</CardTitle>
            <Link href="/budynki">
              <Button variant="outline" size="sm">
                Zarządzaj
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budynki.length}</div>
            <p className="text-xs text-muted-foreground">
              Łącznie pięter: {pietra.length}
            </p>
          </CardContent>
        </Card>

        {/* Sale */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sale</CardTitle>
            <Link href="/sale">
              <Button variant="outline" size="sm">
                Zarządzaj
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sale.length}</div>
            <p className="text-xs text-muted-foreground">
              Łączna liczba miejsc:{" "}
              {sale.reduce((sum, sala) => sum + sala.liczbaMiejsc, 0)}
            </p>
          </CardContent>
        </Card>

        {/* Nauczyciele */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nauczyciele</CardTitle>
            <Link href="/nauczyciele">
              <Button variant="outline" size="sm">
                Zarządzaj
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nauczyciele.length}</div>
            <p className="text-xs text-muted-foreground">
              Liczba przedmiotów: {przedmioty.length}
            </p>
          </CardContent>
        </Card>

        {/* Oddziały */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oddziały</CardTitle>
            <Link href="/oddzialy">
              <Button variant="outline" size="sm">
                Zarządzaj
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oddzialy.length}</div>
            <p className="text-xs text-muted-foreground">
              Łączna liczba lekcji:{" "}
              {oddzialy.reduce(
                (sum, oddzial) => sum + oddzial.liczbaLekcjiTygodnia,
                0,
              )}
            </p>
          </CardContent>
        </Card>

        {/* Przedmioty */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Przedmioty</CardTitle>
            <Link href="/przedmioty">
              <Button variant="outline" size="sm">
                Zarządzaj
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{przedmioty.length}</div>
            <p className="text-xs text-muted-foreground">
              Średnia waga:{" "}
              {(
                przedmioty.reduce((sum, p) => sum + p.waga, 0) /
                (przedmioty.length || 1)
              ).toFixed(1)}
            </p>
          </CardContent>
        </Card>

        {/* Import z Optivum */}
        <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-medium">
                Import z UONET+ Optivum
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Zaimportuj dane z planu lekcji Optivum
              </p>
            </div>
            <ImportDialog />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Nauczyciele i przedmioty</p>
              <p>• Sale lekcyjne</p>
              <p>• Oddziały i ich plany lekcji</p>
            </div>
          </CardContent>
        </Card>

        {/* Ostatnio dodane */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Ostatnio dodane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-2">Budynki</h3>
                <ul className="space-y-1">
                  {budynki.slice(-3).map((budynek) => (
                    <li
                      key={budynek.id}
                      className="text-sm text-muted-foreground"
                    >
                      {budynek.nazwa}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Sale</h3>
                <ul className="space-y-1">
                  {sale.slice(-3).map((sala) => (
                    <li key={sala.id} className="text-sm text-muted-foreground">
                      {sala.nazwa} ({sala.liczbaMiejsc} miejsc)
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Nauczyciele</h3>
                <ul className="space-y-1">
                  {nauczyciele.slice(-3).map((nauczyciel) => (
                    <li
                      key={nauczyciel.id}
                      className="text-sm text-muted-foreground"
                    >
                      {nauczyciel.nazwa} ({nauczyciel.skrot})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <DangerZone />
      </div>
    </div>
  );
}
