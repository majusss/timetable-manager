"use client";

import { createOddzial } from "@/actions/oddzialy";
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

export function AddOddzialDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nazwa: "",
    liczbaLekcjiTygodnia: "0",
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.nazwa) {
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
      data.append("liczbaLekcjiTygodnia", formData.liczbaLekcjiTygodnia);
      await createOddzial(data);

      toast({
        title: "Sukces",
          description: "Oddział został dodany",
        });
        setOpen(false);
        setFormData({
          nazwa: "",
          liczbaLekcjiTygodnia: "0",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas dodawania oddziału",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dodaj oddział</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowy oddział</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nazwa">Nazwa oddziału</Label>
            <Input
              id="nazwa"
              value={formData.nazwa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nazwa: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="liczbaLekcjiTygodnia">
              Liczba lekcji tygodniowo
            </Label>
            <Input
              id="liczbaLekcjiTygodnia"
              type="number"
              min="0"
              value={formData.liczbaLekcjiTygodnia}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  liczbaLekcjiTygodnia: e.target.value,
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
