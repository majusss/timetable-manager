"use client";

import { createNauczyciel } from "@/actions/nauczyciele";
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

export function AddNauczycielDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nazwa: "",
    skrot: "",
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.nazwa || !formData.skrot) {
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
      data.append("skrot", formData.skrot);
      await createNauczyciel(data);

      toast({
        title: "Sukces",
        description: "Nauczyciel został dodany",
      });
      setOpen(false);
      setFormData({
        nazwa: "",
        skrot: "",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas dodawania nauczyciela",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dodaj nauczyciela</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowego nauczyciela</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nazwa">Imię i nazwisko</Label>
            <Input
              id="nazwa"
              value={formData.nazwa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nazwa: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skrot">Skrót</Label>
            <Input
              id="skrot"
              maxLength={3}
              value={formData.skrot}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  skrot: e.target.value.toUpperCase(),
                }))
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
