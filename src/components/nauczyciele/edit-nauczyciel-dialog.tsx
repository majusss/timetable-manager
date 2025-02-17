"use client";

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
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Pencil } from "lucide-react";
import { updateNauczyciel } from "@/actions/nauczyciele";
import { Nauczyciel, Przedmiot } from "@prisma/client";

interface EditNauczycielDialogProps {
  nauczyciel: Nauczyciel & {
    przedmioty: Przedmiot[];
  };
  przedmioty: Przedmiot[];
}

export function EditNauczycielDialog({
  nauczyciel,
  przedmioty,
}: EditNauczycielDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPrzedmioty, setSelectedPrzedmioty] = useState<string[]>(
    nauczyciel.przedmioty.map((p: Przedmiot) => p.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj nauczyciela</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            selectedPrzedmioty.forEach((id) => {
              formData.append("przedmioty", id);
            });
            await updateNauczyciel(nauczyciel.id, formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="nazwa">Nazwa</Label>
            <Input
              id="nazwa"
              name="nazwa"
              defaultValue={nauczyciel.nazwa}
              required
            />
          </div>
          <div>
            <Label htmlFor="skrot">Skrót</Label>
            <Input
              id="skrot"
              name="skrot"
              defaultValue={nauczyciel.skrot}
              required
            />
          </div>
          <div>
            <Label>Przedmioty</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                  type="button"
                >
                  {selectedPrzedmioty.length
                    ? `Wybrano ${selectedPrzedmioty.length} przedmiotów`
                    : "Wybierz przedmioty"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full p-2" align="start">
                <div className="grid grid-cols-1 gap-2">
                  {przedmioty.map((przedmiot) => (
                    <label
                      key={przedmiot.id}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPrzedmioty.includes(przedmiot.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPrzedmioty([
                              ...selectedPrzedmioty,
                              przedmiot.id,
                            ]);
                          } else {
                            setSelectedPrzedmioty(
                              selectedPrzedmioty.filter(
                                (id) => id !== przedmiot.id
                              )
                            );
                          }
                        }}
                      />
                      <span className="text-sm">{przedmiot.nazwa}</span>
                    </label>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
