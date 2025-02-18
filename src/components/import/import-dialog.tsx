"use client";

import { getBudynki } from "@/actions/budynki";
import { getDataToImport } from "@/actions/optivum";
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
import { Budynek } from "@/types";
import { List } from "@majusss/timetable-parser";
import { useEffect, useState } from "react";
import { ImportConfigDialog } from "./import-config-dialog";

export function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [importData, setImportData] = useState<List>({
    classes: [],
  });
  const { toast } = useToast();
  const [buildings, setBuildings] = useState<Budynek[]>([]);

  useEffect(() => {
    getBudynki().then((buildings) => setBuildings(buildings));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await getDataToImport(url);

      if (result.success) {
        toast({
          title: "Sukces",
          description: result.message,
        });
        setImportData(result.list);
        setOpen(false);
        setConfigOpen(true);
      } else {
        toast({
          title: "Błąd",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas importu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Rozpocznij import</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import z UONET+ Optivum</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL do planu lekcji</Label>
              <Input
                id="url"
                placeholder="https://example.com/plan.html"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Wprowadź adres URL do wyeksportowanego planu lekcji z Optivum
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Importowanie..." : "Importuj"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ImportConfigDialog
        url={url}
        open={configOpen}
        onOpenChange={setConfigOpen}
        data={importData}
        buildings={buildings}
      />
    </>
  );
}
