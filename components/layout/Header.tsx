"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { Logo } from "@/components/icons/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "#products", label: t("products") },
    { href: "#features", label: t("features") },
    { href: "#faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center text-foreground">
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
            onClick={() => setIsOpen(true)}
            className="relative rounded-full p-2 hover:bg-muted transition"
            aria-label={t("openCart")}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background px-1">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 hover:bg-muted transition md:hidden"
            aria-label={mobileOpen ? t("closeCart") : t("openCart")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3">
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
