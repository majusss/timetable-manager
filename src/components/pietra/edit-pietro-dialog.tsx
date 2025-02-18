"use client";

import { updatePietro } from "@/actions/pietra";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useState } from "react";

export function EditPietroDialog({
  pietro,
}: {
  pietro: { id: string; numer: number };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj piętro</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updatePietro(pietro.id, formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="numer">Numer piętra</Label>
            <Input
              id="numer"
              name="numer"
              type="number"
              defaultValue={pietro.numer}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Anuluj
            </Button>
            <Button type="submit">Zapisz</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
