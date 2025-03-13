"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const firstMenuContent = (
  <DropdownMenuContent align="start">
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane">Dane</BreadcrumbLink>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/generuj">Generuj</BreadcrumbLink>
    </DropdownMenuItem>
  </DropdownMenuContent>
);

const secondMenuContent = (
  <DropdownMenuContent align="start">
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane/budynki">Budynki</BreadcrumbLink>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane/sale">Sale</BreadcrumbLink>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane/typy-sal">Typy Sal</BreadcrumbLink>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane/nauczyciele">Nauczyciele</BreadcrumbLink>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane/oddzialy">Oddziały</BreadcrumbLink>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <BreadcrumbLink href="/dane/przedmioty">Przedmioty</BreadcrumbLink>
    </DropdownMenuItem>
  </DropdownMenuContent>
);

export default function Navbar() {
  const pathname = usePathname();
  const firstPath = ((path) =>
    path == "" || path == "/"
      ? ""
      : `${path?.[0].toUpperCase() ?? ""}${path?.slice(1) ?? ""}`)(
    pathname.split("/")[1],
  );
  const secondPath = ((path) =>
    `${path?.[0].toUpperCase() ?? ""}${path?.slice(1) ?? ""}`)(
    pathname.split("/")[2],
  );
  return (
    <nav suppressHydrationWarning className="w-full h-14 bg-muted border-b">
      <div className="container flex items-center h-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BreadcrumbSeparator />
              </DropdownMenuTrigger>
              {firstMenuContent}
            </DropdownMenu>
            {!!firstPath && (
              <>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      {firstPath}
                    </DropdownMenuTrigger>

                    {firstMenuContent}
                  </DropdownMenu>
                </BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <BreadcrumbSeparator />
                  </DropdownMenuTrigger>
                  {secondMenuContent}
                </DropdownMenu>
              </>
            )}
            {!!secondPath && (
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {secondPath}
                  </DropdownMenuTrigger>

                  {secondMenuContent}
                </DropdownMenu>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
}
