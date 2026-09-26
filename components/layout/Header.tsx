"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/icons/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "#products", label: t("products") },
    { href: "#features", label: t("features") },
    { href: "#faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href={`/${locale}`} 
          className="flex shrink-0 items-center text-foreground transition-opacity hover:opacity-90"
          dir="ltr"
        >
          <Logo className="h-7 w-auto sm:h-8" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 hover:bg-muted transition md:hidden"
            aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3 bg-background">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
