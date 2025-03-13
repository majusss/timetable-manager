"use client";

import { updatePrzedmiot } from "@/actions/przedmioty";
import { getTypySal } from "@/actions/typySal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export function EditPrzedmiotDialog({
  przedmiot,
}: {
  przedmiot: {
    id: string;
    nazwa: string;
    waga: number;
    typSalaPrzedmiot: { id: string; nazwa: string };
  };
}) {
  const [open, setOpen] = useState(false);
  const [typySal, setTypySal] = useState<{ id: string; nazwa: string }[]>([]);
  const [selectedTyp, setSelectedTyp] = useState<string>(
    przedmiot.typSalaPrzedmiot.id,
  );

  useEffect(() => {
    if (open) {
      getTypySal().then(setTypySal);
    }
  }, [open]);

  // Reset selectedTyp when dialog is opened
  useEffect(() => {
    if (open) {
      setSelectedTyp(przedmiot.typSalaPrzedmiot.id);
    }
  }, [open, przedmiot.typSalaPrzedmiot.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj przedmiot</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            formData.append("typSalaPrzedmiotId", selectedTyp);
            await updatePrzedmiot(przedmiot.id, formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="nazwa">Nazwa przedmiotu</Label>
            <Input
              id="nazwa"
              name="nazwa"
              defaultValue={przedmiot.nazwa}
              required
            />
          </div>
          <div>
            <Label htmlFor="waga">Waga</Label>
            <Input
              id="waga"
              name="waga"
              type="number"
              defaultValue={przedmiot.waga}
              required
            />
          </div>
          <div>
            <Label htmlFor="typ">Typ sali</Label>
            <Select value={selectedTyp} onValueChange={setSelectedTyp}>
              <SelectTrigger>
                <SelectValue>
                  {typySal.find((typ) => typ.id === selectedTyp)?.nazwa ||
                    przedmiot.typSalaPrzedmiot.nazwa}
                </SelectValue>
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
