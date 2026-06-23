"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Locale, navItems, localeNames, locales } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  locale: Locale;
  dict: {
    nav: Record<string, string>;
  };
}

export function Header({ locale, dict }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getPathWithoutLocale = () => {
    const segments = pathname.split("/");
    segments.shift();
    if (locales.includes(segments[0] as Locale)) {
      segments.shift();
    }
    return "/" + segments.join("/");
  };

  const currentPath = getPathWithoutLocale();

  const getLocalizedPath = (href: string, targetLocale: Locale) => {
    return `/${targetLocale}${href === "/" ? "" : href}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={`/${locale}`}
          className="flex items-center"
        >
          <Image src="/images/logo.png" alt="Taher Mahram" width={64} height={64} className="dark:hidden" />
          <Image src="/images/logoForDarckTheme.png" alt="Taher Mahram" width={64} height={64} className="hidden dark:block" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                currentPath === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9" />
              }
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Language</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((l) => (
                <DropdownMenuItem
                  key={l}
                  render={<Link href={getLocalizedPath(currentPath, l)} />}
                >
                  {localeNames[l]}
                  {l === locale && " ✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" />
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={`/${locale}${item.href}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      currentPath === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {dict.nav[item.key]}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
