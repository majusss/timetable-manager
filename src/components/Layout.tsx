import Link from "next/link";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex gap-4">
          <Link href="/budynki" className="hover:text-blue-600">
            Budynki
          </Link>
          <Link href="/pietra" className="hover:text-blue-600">
            Piętra
          </Link>
          <Link href="/sale" className="hover:text-blue-600">
            Sale
          </Link>
          <Link href="/przedmioty" className="hover:text-blue-600">
            Przedmioty
          </Link>
          <Link href="/nauczyciele" className="hover:text-blue-600">
            Nauczyciele
          </Link>
          <Link href="/oddzialy" className="hover:text-blue-600">
            Oddziały
          </Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
