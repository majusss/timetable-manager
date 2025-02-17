"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Przedmiot } from "@prisma/client";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { createNauczyciel } from "@/actions/nauczyciele";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Dodawanie..." : "Dodaj nauczyciela"}
    </Button>
  );
}

export function NauczycielForm({ przedmioty }: { przedmioty: Przedmiot[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [selectedPrzedmioty, setSelectedPrzedmioty] = useState<string[]>([]);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        selectedPrzedmioty.forEach((id) => {
          formData.append("przedmioty", id);
        });
        await createNauczyciel(formData);
        ref.current?.reset();
        setSelectedPrzedmioty([]);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="nazwa">Nazwa</Label>
        <Input id="nazwa" name="nazwa" required />
      </div>
      <div>
        <Label htmlFor="skrot">Skrót</Label>
        <Input id="skrot" name="skrot" required />
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
                          selectedPrzedmioty.filter((id) => id !== przedmiot.id)
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
      <SubmitButton />
    </form>
  );
}
