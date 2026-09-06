"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Logo } from "@/components/icons/Logo";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-start">
            <Link href={`/${locale}`} className="inline-flex items-center justify-center md:justify-start text-foreground">
              <Logo className="h-6 w-auto sm:h-7" />
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p></p>
            <p className="mt-1">© 2026 RAI Studio. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
