"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimeScene } from "@/components/effects/AnimeScene";
import { SaleCountdown } from "./SaleCountdown";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-start"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {t("badge")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("headline")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("subheadline")}
            </p>
            <SaleCountdown />
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-background font-medium hover:opacity-90 transition"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 font-medium hover:bg-muted transition"
              >
                {t("ctaSecondary")}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-80 w-full rounded-3xl border border-border shadow-lg lg:h-[420px]"
          >
            <AnimeScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
