"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ur: "اردو",
  ja: "日本語",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Replace current locale prefix with target locale prefix
  const getHref = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/");
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted transition"
        aria-label={t("home")}
      >
        {labels[locale as Locale]}
        <span className="text-xs text-muted-foreground">▼</span>
      </button>
      <div className="absolute end-0 top-full mt-2 hidden min-w-[120px] rounded-xl border border-border bg-background shadow-lg group-hover:block">
        {locales.map((l) => (
          <Link
            key={l}
            href={getHref(l)}
            className={`block px-4 py-2 text-sm hover:bg-muted first:rounded-t-xl last:rounded-b-xl ${
              l === locale ? "font-semibold text-primary" : "text-foreground"
            }`}
          >
            {labels[l]}
          </Link>
        ))}
      </div>
    </div>
  );
}
