"use client";

import { createOddzial } from "@/actions/oddzialy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Dodawanie..." : "Dodaj oddział"}
    </Button>
  );
}

export function OddzialForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createOddzial(formData);
        ref.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="nazwa">Nazwa oddziału</Label>
        <Input id="nazwa" name="nazwa" required />
      </div>
      <div>
        <Label htmlFor="liczbaLekcjiTygodnia">Liczba lekcji w tygodniu</Label>
        <Input
          id="liczbaLekcjiTygodnia"
          name="liczbaLekcjiTygodnia"
          type="number"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
