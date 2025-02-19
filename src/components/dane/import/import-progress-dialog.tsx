"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ImportProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: {
    current: number;
    total: number;
    currentItem: string;
    status: ImportStatus;
    errors: string[];
  };
}

type ImportStatus = "pending" | "completed" | "completed_with_errors" | "error";

export function ImportProgressDialog({
  open,
  onOpenChange,
  progress,
}: ImportProgressDialogProps) {
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
