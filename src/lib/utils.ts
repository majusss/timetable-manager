import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPietroNumer(numer: number) {
  return numer === 0
    ? "Parter"
    : numer < 0
      ? `Poziom ${numer}`
      : `Piętro ${numer}`;
}
