"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { createSala } from "@/actions/sale";
import { useToast } from "@/hooks/use-toast";
import { formatPietroNumer } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Budynek } from "@/types";

interface SalaFormProps {
  budynki: Budynek[];
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isLoading}>
      {pending ? "Dodawanie..." : "Dodaj salę"}
    </Button>
  );
}

export function SalaForm({ budynki }: SalaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (
      !form.nazwa.value ||
      !form.pietroId.value ||
      !form.liczbaMiejsc.value
    ) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createSala({
        nazwa: form.nazwa.value,
        liczbaMiejsc: parseInt(form.liczbaMiejsc.value),
        pietroId: form.pietroId.value,
      });

      toast({
        title: "Sukces",
        description: "Sala została dodana",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać sali",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nazwa">Nazwa sali</Label>
        <Input id="nazwa" name="nazwa" required />
      </div>
      <div>
        <Label htmlFor="liczbaMiejsc">Liczba miejsc</Label>
        <Input
          id="liczbaMiejsc"
          name="liczbaMiejsc"
          type="number"
          min="0"
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Budynek</label>
        <Select name="budynekId">
          <SelectTrigger>
            <SelectValue placeholder="Wybierz budynek" />
          </SelectTrigger>
          <SelectContent>
            {budynki.map((building) => (
              <SelectItem key={building.id} value={building.id}>
                {building.nazwa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {ref.current?.budynekId && (
        <div className="grid gap-2">
          <label className="text-sm font-medium">Piętro</label>
          <Select name="pietroId">
            <SelectTrigger>
              <SelectValue placeholder="Wybierz piętro" />
            </SelectTrigger>
            <SelectContent>
              {budynki
                .find((b) => b.id === ref.current?.budynekId)
                ?.pietra.map((pietro) => (
                  <SelectItem key={pietro.id} value={pietro.id}>
                    {formatPietroNumer(pietro.numer)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <SubmitButton isLoading={isLoading} />
    </form>
  );
}
