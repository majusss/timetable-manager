"use client";

import { createPrzedmiot } from "@/actions/przedmioty";
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function AddPrzedmiotDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nazwa: "",
    waga: "1",
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.nazwa || !formData.waga) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("nazwa", formData.nazwa);
      data.append("waga", formData.waga);
      await createPrzedmiot(data);

      toast({
        title: "Sukces",
        description: "Przedmiot został dodany",
        });
        setOpen(false);
        setFormData({
          nazwa: "",
          waga: "1",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas dodawania przedmiotu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dodaj przedmiot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowy przedmiot</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nazwa">Nazwa przedmiotu</Label>
            <Input
              id="nazwa"
              value={formData.nazwa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nazwa: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="waga">Waga</Label>
            <Input
              id="waga"
              type="number"
              min="1"
              max="10"
              value={formData.waga}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, waga: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Dodawanie..." : "Dodaj"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
