import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBudynki } from "@/actions/budynki";
import { getPietra } from "@/actions/pietra";
import { getSale } from "@/actions/sale";
import { getPrzedmioty } from "@/actions/przedmioty";
import { getNauczyciele } from "@/actions/nauczyciele";
import { getOddzialy } from "@/actions/oddzialy";

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
    <div className="container mx-auto p-6">
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
                0
              )}
            </p>
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
    </div>
  );
}
