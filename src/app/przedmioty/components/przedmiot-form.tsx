"use client";

import { createPrzedmiot } from "@/actions/przedmioty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Dodawanie..." : "Dodaj przedmiot"}
    </Button>
  );
}

export function PrzedmiotForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createPrzedmiot(formData);
        ref.current?.reset();
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
      <SubmitButton />
    </form>
  );
}
