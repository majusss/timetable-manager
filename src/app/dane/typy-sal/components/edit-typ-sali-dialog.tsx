"use client";

import { updateTypSali } from "@/actions/typySal";
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

export function EditTypSaliDialog({
  typ,
}: {
  typ: { id: string; nazwa: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={typ.nazwa === "Ogólny"}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj typ sali</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updateTypSali(typ.id, formData.get("nazwa") as string);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="nazwa">Nazwa typu sali</Label>
            <Input id="nazwa" name="nazwa" defaultValue={typ.nazwa} required />
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
