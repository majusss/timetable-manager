"use client";

import { deleteTypSali } from "@/actions/typySal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteTypSaliDialog({
  typ,
}: {
  typ: {
    id: string;
    nazwa: string;
    _count: { sale: number; przedmioty: number };
  };
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700"
          disabled={
            typ._count.sale > 0 ||
            typ._count.przedmioty > 0 ||
            typ.nazwa === "Ogólny"
          }
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy na pewno chcesz usunąć ten typ sali?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Typ sali "{typ.nazwa}" zostanie usunięty. Tej akcji nie można
            cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteTypSali(typ.id)}
            className="bg-red-500 hover:bg-red-600"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
