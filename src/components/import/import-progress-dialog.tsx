"use client";

import { addNauczyciel, addOddzial, addSala } from "@/actions/optivum";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { List } from "@majusss/timetable-parser";
import { useEffect, useState } from "react";

interface ImportProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: List;
  config: {
    importConfig: {
      url: string;
      oddzialy: boolean;
      sale: boolean;
      nauczyciele: boolean;
    };
    defaultConfig: {
      liczbaMiejsc: string;
      pietroId: string;
    };
  };
  onImportComplete?: () => void;
}

type ImportStatus = "pending" | "completed" | "completed_with_errors" | "error";

export function ImportProgressDialog({
  open,
  onOpenChange,
  data,
  config,
  onImportComplete,
}: ImportProgressDialogProps) {
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
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    const importData = async () => {
      const total =
        (config.importConfig.oddzialy ? data.classes?.length || 0 : 0) +
        (config.importConfig.sale ? data.rooms?.length || 0 : 0) +
        (config.importConfig.nauczyciele ? data.teachers?.length || 0 : 0);

      setProgress({
        current: 0,
        total,
        currentItem: "",
        status: "pending",
        errors: [],
      });

      const errors: string[] = [];

      if (config.importConfig.oddzialy && data.classes) {
        for (const oddzial of data.classes) {
          setProgress((prev) => ({
            ...prev,
            currentItem: `Importowanie oddziału: ${oddzial.name}`,
          }));

          const result = await addOddzial(
            oddzial.name,
            `${config.importConfig.url}/plany/o${oddzial.value}.html`,
          );

          if (!result.success) {
            errors.push(
              `Błąd importu oddziału ${oddzial.name}: ${result.error}`,
            );
            setProgress((prev) => ({
              ...prev,
              errors,
            }));
          }
          setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
        }
      }

      if (config.importConfig.sale && data.rooms) {
        for (const sala of data.rooms) {
          setProgress((prev) => ({
            ...prev,
            currentItem: `Importowanie sali: ${sala.name}`,
          }));
          const result = await addSala(sala, config.defaultConfig);
          if (!result.success) {
            errors.push(`Błąd importu sali ${sala.name}: ${result.error}`);
            setProgress((prev) => ({
              ...prev,
              errors,
            }));
          }
          setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
        }
      }

      if (config.importConfig.nauczyciele && data.teachers) {
        for (const nauczyciel of data.teachers) {
          setProgress((prev) => ({
            ...prev,
            currentItem: `Importowanie nauczyciela: ${nauczyciel.name}`,
          }));
          const result = await addNauczyciel({
            name: nauczyciel.name,
            short: nauczyciel.name.substring(0, 3).toUpperCase(),
          });
          if (!result.success) {
            errors.push(
              `Błąd importu nauczyciela ${nauczyciel.name}: ${result.error}`,
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
        onOpenChange(false);
        onImportComplete?.();
      }, 1500);
    };

    importData();
  }, [open, data, config, onOpenChange, toast, onImportComplete]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {progress.status === "completed"
              ? "Import zakończony"
              : progress.status === "completed_with_errors"
                ? "Import zakończony z błędami"
                : progress.status === "error"
                  ? "Błąd importu"
                  : "Importowanie..."}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Progress
            value={Math.round((progress.current / progress.total) * 100)}
          />
          <div className="text-sm text-muted-foreground">
            {progress.status === "pending" && (
              <>
                {progress.currentItem}
                <br />
                Postęp: {progress.current} z {progress.total}
              </>
            )}
            {(progress.status === "completed" ||
              progress.status === "completed_with_errors") && (
              <div className="space-y-2">
                <p>Import zakończony</p>
                {progress.errors.length > 0 && (
                  <div className="space-y-1 text-destructive">
                    <p>Błędy podczas importu:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {progress.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
