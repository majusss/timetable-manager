"use client";

import { createSala } from "@/actions/sale";
import { getTypySal } from "@/actions/typySal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPietroNumer } from "@/lib/utils";
import { Budynek } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

interface SalaFormProps {
  budynki: Budynek[];
}

export function SalaForm({ budynki }: SalaFormProps) {
  const ref = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [typySal, setTypySal] = useState<{ id: string; nazwa: string }[]>([]);
  const [selectedTyp, setSelectedTyp] = useState<string>("");
  const [selectedBudynekId, setSelectedBudynekId] = useState("");

  useEffect(() => {
    getTypySal().then(setTypySal);
  }, []);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createSala({
          nazwa: formData.get("nazwa") as string,
          liczbaMiejsc: parseInt(formData.get("liczbaMiejsc") as string),
          pietroId: formData.get("pietroId") as string,
          typSalaPrzedmiotId: selectedTyp || undefined,
        });
        ref.current?.reset();
        setSelectedTyp("");
        setSelectedBudynekId("");
      }}
      className="space-y-4"
    >
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
          defaultValue="30"
          required
        />
      </div>
      <div>
        <Label htmlFor="typ">Typ sali</Label>
        <Select value={selectedTyp} onValueChange={setSelectedTyp}>
          <SelectTrigger>
            <SelectValue placeholder="Ogólny" />
          </SelectTrigger>
          <SelectContent>
            {typySal.map((typ) => (
              <SelectItem key={typ.id} value={typ.id}>
                {typ.nazwa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="budynek">Budynek</Label>
        <Select
          value={selectedBudynekId}
          onValueChange={(value) => setSelectedBudynekId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz budynek" />
          </SelectTrigger>
          <SelectContent>
            {budynki.map((budynek) => (
              <SelectItem key={budynek.id} value={budynek.id}>
                {budynek.nazwa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedBudynekId && (
        <div>
          <Label htmlFor="pietro">Piętro</Label>
          <Select name="pietroId">
            <SelectTrigger>
              <SelectValue placeholder="Wybierz piętro" />
            </SelectTrigger>
            <SelectContent>
              {budynki
                .find((b) => b.id === selectedBudynekId)
                ?.pietra?.map((pietro) => (
                  <SelectItem key={pietro.id} value={pietro.id}>
                    {formatPietroNumer(pietro.numer)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Dodawanie..." : "Dodaj salę"}
      </Button>
    </form>
  );
}
