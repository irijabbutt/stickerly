"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/icons/Logo";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo & Tagline Container */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link
              href={`/${locale}`}
              className="flex shrink-0 items-center text-foreground transition-opacity hover:opacity-90"
              dir="ltr"
            >
              <Logo className="h-7 w-auto sm:h-8" />
            </Link>
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              {t("tagline") || "Premium digital assets for curious creators."}
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            © {year} RAI Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
