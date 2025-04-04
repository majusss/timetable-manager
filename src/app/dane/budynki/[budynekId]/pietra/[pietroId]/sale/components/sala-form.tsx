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
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function SalaForm({ pietroId }: { pietroId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [typySal, setTypySal] = useState<{ id: string; nazwa: string }[]>([]);
  const [selectedTyp, setSelectedTyp] = useState<string>("");

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
          pietroId: pietroId,
          typSalaPrzedmiotId: selectedTyp || undefined,
        });
        ref.current?.reset();
        setSelectedTyp("");
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
      <Button type="submit" disabled={pending}>
        {pending ? "Dodawanie..." : "Dodaj salę"}
      </Button>
    </form>
  );
}
