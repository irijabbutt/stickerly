"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { key: "step1", icon: Search },
    { key: "step2", icon: Download },
  ];

  return (
    <section id="how-it-works" className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
          {steps.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center p-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background text-xl font-bold shadow-lg">
                {i + 1}
              </div>
              <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{t(`${key}.title`)}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
