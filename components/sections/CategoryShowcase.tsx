"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Zap, Box, ArrowRight } from "lucide-react";

const categories = [
  { key: "stickers", slug: "stickers", icon: Sparkles, gradient: "from-rose-400 to-amber-300" },
  { key: "animated", slug: "animated-ui", icon: Zap, gradient: "from-violet-400 to-cyan-300" },
  { key: "3d", slug: "3d-scenes", icon: Box, gradient: "from-emerald-400 to-teal-300" },
] as const;

export function CategoryShowcase() {
  const t = useTranslations("categories");
  const tc = useTranslations("products");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("showcaseTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("showcaseSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ key, slug, icon: Icon, gradient }) => (
            <motion.div
              key={key}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/${locale}/category/${slug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:shadow-lg"
              >
                <div
                  className={`flex h-40 items-center justify-center bg-gradient-to-br ${gradient} p-6`}
                >
                  <Icon className="h-16 w-16 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold">{t(`${key}.headline`)}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {t(`${key}.subheadline`)}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    {tc("viewDetails") || "Explore"}
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
