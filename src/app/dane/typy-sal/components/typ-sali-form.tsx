"use client";

import { createTypSali } from "@/actions/typySal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

export function TypSaliForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createTypSali(formData.get("nazwa") as string);
        ref.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="nazwa">Nazwa typu sali</Label>
        <Input id="nazwa" name="nazwa" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Dodawanie..." : "Dodaj typ sali"}
      </Button>
    </form>
  );
}
