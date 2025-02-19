"use client";

import { addNauczyciel, addOddzial, addSala } from "@/actions/optivum";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { List } from "@majusss/timetable-parser";
import { useEffect, useState } from "react";
import { ImportProgressDialog } from "./import-progress-dialog";

type ImportStatus = "pending" | "completed" | "completed_with_errors" | "error";

interface ImportConfigDialogProps {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: List;
  buildings: Budynek[];
}

export function ImportConfigDialog({
  url,
  open,
  onOpenChange,
  data,
  buildings,
}: ImportConfigDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [importConfig, setImportConfig] = useState({
    url,
    oddzialy: true,
    sale: !!data.rooms?.length,
    nauczyciele: !!data.teachers?.length,
  });
  const [defaultConfig, setDefaultConfig] = useState({
    liczbaMiejsc: "30",
    budynekId: "",
    pietroId: "",
  });
  const [showProgress, setShowProgress] = useState(false);
  const { toast } = useToast();

  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    currentItem: string;
    status: ImportStatus;
    errors: string[];
  }>({
    current: 0,
    total: 0,
    currentItem: "",
    status: "pending",
    errors: [],
  });

  const handleImportComplete = () => {
    setIsLoading(false);
    setImportConfig({
      url,
      oddzialy: true,
      sale: !!data.rooms?.length,
      nauczyciele: !!data.teachers?.length,
    });
    setDefaultConfig({
      liczbaMiejsc: "30",
      budynekId: "",
      pietroId: "",
    });
  };

  const handleImport = async () => {
    if (!data) {
      toast({
        title: "Błąd",
        description: "Brak danych do importu",
        variant: "destructive",
      });
      return;
    }

    if (
      importConfig.sale &&
      (!defaultConfig.pietroId || !defaultConfig.liczbaMiejsc)
    ) {
      toast({
        title: "Błąd",
        description: "Wybierz piętro i liczbę miejsc dla sal",
        variant: "destructive",
      });
      return;
    }

    if (
      !importConfig.oddzialy &&
      !importConfig.sale &&
      !importConfig.nauczyciele
    ) {
      toast({
        title: "Błąd",
        description: "Wybierz co najmniej jeden element do importu",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    onOpenChange(false);
    setShowProgress(true);

    const total =
      (importConfig.oddzialy ? data.classes?.length || 0 : 0) +
      (importConfig.sale ? data.rooms?.length || 0 : 0) +
      (importConfig.nauczyciele ? data.teachers?.length || 0 : 0);

    setProgress({
      current: 0,
      total,
      currentItem: "",
      status: "pending",
      errors: [],
    });

    const errors: string[] = [];

    try {
      if (importConfig.oddzialy && data.classes) {
        for (const branch of data.classes) {
          setProgress((prev) => ({
            ...prev,
            currentItem: `Importowanie oddziału: ${branch.name}`,
          }));

          const result = await addOddzial(
            branch.name,
            `${importConfig.url}/plany/o${branch.value}.html`,
          );

          if (!result.success) {
            errors.push(
              `Błąd importu oddziału ${branch.name}: ${result.error}`,
            );
            setProgress((prev) => ({
              ...prev,
              errors,
            }));
          }
          setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
        }
      }

      if (importConfig.sale && data.rooms) {
        for (const room of data.rooms) {
          setProgress((prev) => ({
            ...prev,
            currentItem: `Importowanie sali: ${room.name}`,
          }));

          const result = await addSala(room.name, {
            liczbaMiejsc: defaultConfig.liczbaMiejsc,
            pietroId: defaultConfig.pietroId,
          });

          if (!result.success) {
            errors.push(`Błąd importu sali ${room.name}: ${result.error}`);
            setProgress((prev) => ({
              ...prev,
              errors,
            }));
          }
          setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
        }
      }

      if (importConfig.nauczyciele && data.teachers) {
        for (const teacher of data.teachers) {
          setProgress((prev) => ({
            ...prev,
            currentItem: `Importowanie nauczyciela: ${teacher.name}`,
          }));

          const result = await addNauczyciel(
            teacher.name,
            `${importConfig.url}/plany/n${teacher.value}.html`,
          );

          if (!result.success) {
            errors.push(
              `Błąd importu nauczyciela ${teacher.name}: ${result.error}`,
            );
            setProgress((prev) => ({
              ...prev,
              errors,
            }));
          }
          setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
        }
      }

      const hasErrors = errors.length > 0;

      setProgress((prev) => ({
        ...prev,
        status: hasErrors ? "completed_with_errors" : "completed",
      }));

      if (hasErrors) {
        toast({
          title: "Import zakończony z błędami",
          description: "Niektóre elementy nie zostały zaimportowane",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sukces",
          description: "Import zakończony pomyślnie",
        });
      }

      setTimeout(() => {
        setShowProgress(false);
        handleImportComplete();
      }, 1500);
    } catch (error) {
      console.error("Błąd importu:", error);
      setProgress((prev) => ({
        ...prev,
        status: "error",
      }));
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas importu",
        variant: "destructive",
      });
    }
  };

  const isImportDisabled =
    isLoading ||
    (!importConfig.oddzialy &&
      !importConfig.sale &&
      !importConfig.nauczyciele) ||
    (importConfig.sale &&
      (!defaultConfig.pietroId || !defaultConfig.liczbaMiejsc));

  useEffect(() => {
    setImportConfig((pre) => ({ ...pre, url }));
  }, [url]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Konfiguracja importu</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Co chcesz zaimportować?</h3>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oddzialy"
                    checked={importConfig.oddzialy}
                    onCheckedChange={(checked) =>
                      setImportConfig((prev) => ({
                        ...prev,
                        oddzialy: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="oddzialy" className="flex items-center gap-2">
                    Oddziały
                    <span className="text-sm text-muted-foreground">
                      ({data.classes.length} znalezionych)
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sale"
                    checked={importConfig.sale}
                    disabled={!data.rooms?.length}
                    onCheckedChange={(checked) =>
                      setImportConfig((prev) => ({ ...prev, sale: !!checked }))
                    }
                  />
                  <Label htmlFor="sale" className="flex items-center gap-2">
                    Sale
                    <span className="text-sm text-muted-foreground">
                      {data.rooms?.length
                        ? `(${data.rooms.length} znalezionych)`
                        : "(brak na planie)"}
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nauczyciele"
                    checked={importConfig.nauczyciele}
                    disabled={!data.teachers?.length}
                    onCheckedChange={(checked) =>
                      setImportConfig((prev) => ({
                        ...prev,
                        nauczyciele: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="nauczyciele"
                    className="flex items-center gap-2"
                  >
                    Nauczyciele
                    <span className="text-sm text-muted-foreground">
                      {data.teachers?.length
                        ? `(${data.teachers.length} znalezionych)`
                        : "(brak na planie)"}
                    </span>
                  </Label>
                </div>
              </div>
            </div>

            {importConfig.sale && data.rooms?.length && (
              <div className="space-y-4">
                <h3 className="font-medium">Konfiguracja sal</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="liczbaMiejsc">
                      Domyślna liczba miejsc w sali
                    </Label>
                    <Input
                      id="liczbaMiejsc"
                      type="number"
                      value={defaultConfig.liczbaMiejsc}
                      onChange={(e) =>
                        setDefaultConfig((prev) => ({
                          ...prev,
                          liczbaMiejsc: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="budynek">Budynek</Label>
                    <Select
                      value={defaultConfig.budynekId}
                      onValueChange={(value) => {
                        setDefaultConfig((prev) => ({
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
                        {buildings.map((building) => (
                          <SelectItem key={building.id} value={building.id}>
                            {building.nazwa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {defaultConfig.budynekId && (
                    <div className="grid gap-2">
                      <Label htmlFor="pietro">Piętro</Label>
                      <Select
                        value={defaultConfig.pietroId}
                        onValueChange={(value) =>
                          setDefaultConfig((prev) => ({
                            ...prev,
                            pietroId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz piętro" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings
                            .find((b) => b.id === defaultConfig.budynekId)
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
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Anuluj
              </Button>
              <Button onClick={handleImport} disabled={isImportDisabled}>
                {isLoading ? "Importowanie..." : "Importuj"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ImportProgressDialog
        open={showProgress}
        onOpenChange={setShowProgress}
        progress={progress}
      />
    </>
  );
}
