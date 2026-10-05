"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimeScene } from "@/components/effects/AnimeScene";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="animate-rise text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t("badge")}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:mt-6 sm:text-5xl lg:text-6xl">
              {t("headline")}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              {t("subheadline")}
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 lg:justify-start">
              <a
                href="#products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background transition hover:opacity-90"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 py-3 font-medium transition hover:bg-muted"
              >
                {t("ctaSecondary")}
              </a>
            </div>
          </div>

          {/* Reserved height = no layout shift; shorter on phones so the CTA stays above the fold */}
          <div className="relative h-56 w-full rounded-3xl border border-border shadow-lg sm:h-72 lg:h-[420px]">
            <AnimeScene />
          </div>
        </div>
      </div>
    </section>
  );
}
