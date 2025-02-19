"use client";

import { updateNauczyciel } from "@/actions/nauczyciele";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Nauczyciel, Przedmiot } from "@prisma/client";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { useState } from "react";

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
    nauczyciel.przedmioty.map((p: Przedmiot) => p.id),
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                  type="button"
                >
                  {selectedPrzedmioty.length
                    ? `Wybrano ${selectedPrzedmioty.length} przedmiotów`
                    : "Wybierz przedmioty"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Szukaj przedmiotu..." />
                  <CommandList>
                    <CommandEmpty>Brak przedmiotów.</CommandEmpty>
                    <CommandGroup>
                      {przedmioty.map((przedmiot) => (
                        <CommandItem
                          key={przedmiot.id}
                          onSelect={() => {
                            setSelectedPrzedmioty((prev) =>
                              prev.includes(przedmiot.id)
                                ? prev.filter((id) => id !== przedmiot.id)
                                : [...prev, przedmiot.id],
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "bg-muted rounded",
                              selectedPrzedmioty.includes(przedmiot.id)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {przedmiot.nazwa}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
