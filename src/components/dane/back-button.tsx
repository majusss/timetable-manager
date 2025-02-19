import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 py-1"
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </Link>
  );
}
