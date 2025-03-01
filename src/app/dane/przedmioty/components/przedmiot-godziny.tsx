"use client";

import { getPrzedmiotGodziny } from "@/actions/przedmioty";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PrzedmiotGodzinyProps {
  przedmiotId: string;
}

export function PrzedmiotGodziny({ przedmiotId }: PrzedmiotGodzinyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [godziny, setGodziny] = useState<
    | {
        id: string;
        oddzial: { nazwa: string };
        godzTygodnia: number;
      }[]
    | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);

  const loadGodziny = async () => {
    if (godziny) {
      setIsOpen(!isOpen);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getPrzedmiotGodziny(przedmiotId);
      setGodziny(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Błąd ładowania godzin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={loadGodziny}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ładowanie...
          </>
        ) : (
          <>{isOpen ? "Ukryj godziny" : "Pokaż godziny"}</>
        )}
      </Button>

      {isOpen && godziny && godziny.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-muted-foreground">
            <div className="font-medium mb-1">Godziny w oddziałach:</div>
            <ul className="list-disc list-inside">
              {godziny
                .sort((a, b) => a.oddzial.nazwa.localeCompare(b.oddzial.nazwa))
                .map((g) => (
                  <li key={g.id}>
                    {g.oddzial.nazwa}: {g.godzTygodnia} godz./tydzień
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
