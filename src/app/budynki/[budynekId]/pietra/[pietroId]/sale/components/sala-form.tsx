"use client";

import { createSala } from "@/actions/sale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Dodawanie..." : "Dodaj salę"}
    </Button>
  );
}

export function SalaForm({ pietroId }: { pietroId: string }) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createSala({
          nazwa: formData.get("nazwa") as string,
          liczbaMiejsc: parseInt(formData.get("liczbaMiejsc") as string),
          pietroId: pietroId,
        });
        ref.current?.reset();
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
      <SubmitButton />
    </form>
  );
}
