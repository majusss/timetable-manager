"use client";

import { clearDatabase } from "@/actions/danger";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function DangerZone() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClearDatabase = async () => {
    setIsLoading(true);
    try {
      const result = await clearDatabase();
      if (result.success) {
        toast({
          title: "Sukces",
          description: "Baza danych została wyczyszczona",
        });
      } else {
        toast({
          title: "Błąd",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-full bg-destructive/5 border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive text-lg">
          Niebezpieczna strefa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Wyczyść bazę danych</p>
            <p className="text-sm text-muted-foreground">
              Ta akcja usunie wszystkie dane z bazy danych, w tym budynki, sale,
              nauczycieli i oddziały.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isLoading}>
                {isLoading ? "Czyszczenie..." : "Wyczyść bazę danych"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Czy na pewno chcesz wyczyścić bazę danych?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ta akcja usunie wszystkie dane z bazy danych. Tej operacji nie
                  można cofnąć. Upewnij się, że masz kopię zapasową, jeśli
                  potrzebujesz zachować jakiekolwiek dane.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleClearDatabase}
                >
                  Tak, wyczyść bazę danych
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
