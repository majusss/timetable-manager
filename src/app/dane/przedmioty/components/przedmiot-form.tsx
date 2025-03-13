"use client";

import { createPrzedmiot } from "@/actions/przedmioty";
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

export function PrzedmiotForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [typySal, setTypySal] = useState<{ id: string; nazwa: string }[]>([]);
  const [selectedTyp, setSelectedTyp] = useState<string>("");

  // Pobierz typy sal przy pierwszym renderowaniu
  useEffect(() => {
    getTypySal().then(setTypySal);
  }, []);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createPrzedmiot(
          formData.get("nazwa") as string,
          +formData.get("waga")! as number,
          selectedTyp || undefined,
        );
        ref.current?.reset();
        setSelectedTyp("");
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="nazwa">Nazwa przedmiotu</Label>
        <Input id="nazwa" name="nazwa" required />
      </div>
      <div>
        <Label htmlFor="waga">Waga</Label>
        <Input id="waga" name="waga" type="number" required />
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
        {pending ? "Zapisywanie..." : "Zapisz"}
      </Button>
    </form>
  );
}
