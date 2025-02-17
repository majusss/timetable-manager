"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { updateSala } from "@/actions/sale";

export function EditSalaDialog({
  sala,
}: {
  sala: { id: string; nazwa: string; liczbaMiejsc: number };
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
          <DialogTitle>Edytuj salę</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) => {
            await updateSala(sala.id, formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="nazwa">Nazwa sali</Label>
            <Input id="nazwa" name="nazwa" defaultValue={sala.nazwa} required />
          </div>
          <div>
            <Label htmlFor="liczbaMiejsc">Liczba miejsc</Label>
            <Input
              id="liczbaMiejsc"
              name="liczbaMiejsc"
              type="number"
              defaultValue={sala.liczbaMiejsc}
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
