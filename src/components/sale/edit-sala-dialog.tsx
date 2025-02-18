"use client";

import { updateSala } from "@/actions/sale";
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
import { useToast } from "@/hooks/use-toast";
import { formatPietroNumer } from "@/lib/utils";
import { Budynek, Sala } from "@/types";
import { useState } from "react";

interface EditSalaDialogProps {
  sala: Sala;
  budynki: Budynek[];
}

export function EditSalaDialog({ sala, budynki }: EditSalaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nazwa: sala.nazwa,
    liczbaMiejsc: sala.liczbaMiejsc.toString(),
    budynekId: sala.pietro.budynek.id,
    pietroId: sala.pietro.id,
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.nazwa || !formData.pietroId || !formData.liczbaMiejsc) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateSala(sala.id, {
        nazwa: formData.nazwa,
        liczbaMiejsc: parseInt(formData.liczbaMiejsc),
        pietroId: formData.pietroId,
      });

      toast({
        title: "Sukces",
        description: "Sala została zaktualizowana",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas aktualizacji sali",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edytuj
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edytuj salę</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nazwa">Nazwa sali</Label>
            <Input
              id="nazwa"
              value={formData.nazwa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nazwa: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="liczbaMiejsc">Liczba miejsc</Label>
            <Input
              id="liczbaMiejsc"
              type="number"
              min="0"
              value={formData.liczbaMiejsc}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  liczbaMiejsc: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="budynek">Budynek</Label>
            <Select
              value={formData.budynekId}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  budynekId: value,
                  pietroId: "",
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz budynek" />
              </SelectTrigger>
              <SelectContent>
                {budynki.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.nazwa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.budynekId && (
            <div className="grid gap-2">
              <Label htmlFor="pietro">Piętro</Label>
              <Select
                value={formData.pietroId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, pietroId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz piętro" />
                </SelectTrigger>
                <SelectContent>
                  {budynki
                    .find((b) => b.id === formData.budynekId)
                    ?.pietra.map((pietro) => (
                      <SelectItem key={pietro.id} value={pietro.id}>
                        {formatPietroNumer(pietro.numer)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
