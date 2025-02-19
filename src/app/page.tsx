import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";

// export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dbSize =
    (await db.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database()));`) as {
      pg_size_pretty: string;
    }[];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Panel zarządzania szkołą</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dane */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dane</CardTitle>
            <Link href="/dane">
              <Button variant="outline" size="sm">
                Zarządzaj
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Baza danych</div>
            <p className="text-xs text-muted-foreground">
              Rozmiar bazy danych: {dbSize[0].pg_size_pretty}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
