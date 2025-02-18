"use client";

import { createSala } from "@/actions/sale";
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
import { Budynek } from "@/types";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isLoading}>
      {pending ? "Dodawanie..." : "Dodaj salę"}
    </Button>
  );
}

interface AddSalaDialogProps {
  budynki: Budynek[];
}

export function AddSalaDialog({ budynki }: AddSalaDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedBudynekId, setSelectedBudynekId] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    nazwa: "",
    liczbaMiejsc: "30",
    budynekId: "",
    pietroId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
      await createSala({
        nazwa: formData.nazwa,
        liczbaMiejsc: parseInt(formData.liczbaMiejsc),
        pietroId: formData.pietroId,
      });

      toast({
        title: "Sukces",
        description: "Sala została dodana",
      });
      setOpen(false);
      setFormData({
        nazwa: "",
        liczbaMiejsc: "30",
        budynekId: "",
        pietroId: "",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas dodawania sali",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dodaj salę</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową salę</DialogTitle>
        </DialogHeader>
        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="nazwa">Nazwa sali</Label>
            <Input
              id="nazwa"
              name="nazwa"
              required
              value={formData.nazwa}
              onChange={(e) =>
                setFormData({ ...formData, nazwa: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="liczbaMiejsc">Liczba miejsc</Label>
            <Input
              id="liczbaMiejsc"
              name="liczbaMiejsc"
              type="number"
              min="0"
              defaultValue="30"
              required
              value={formData.liczbaMiejsc}
              onChange={(e) =>
                setFormData({ ...formData, liczbaMiejsc: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="budynek">Budynek</Label>
            <Select
              name="budynekId"
              required
              value={formData.budynekId}
              onValueChange={(value) => {
                setSelectedBudynekId(value);
                setFormData({ ...formData, budynekId: value });
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
          {selectedBudynekId && (
            <div className="grid gap-2">
              <Label htmlFor="pietro">Piętro</Label>
              <Select
                name="pietroId"
                required
                value={formData.pietroId}
                onValueChange={(value) =>
                  setFormData({ ...formData, pietroId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz piętro" />
                </SelectTrigger>
                <SelectContent>
                  {budynki
                    .find((b) => b.id === selectedBudynekId)
                    ?.pietra.map((pietro) => (
                      <SelectItem key={pietro.id} value={pietro.id}>
                        {formatPietroNumer(pietro.numer)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <SubmitButton isLoading={isLoading} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
