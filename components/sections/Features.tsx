"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Download, Languages, Crown, ShieldCheck } from "lucide-react";

export function Features() {
  const t = useTranslations("features");

  const features = [
    {
      key: "instant",
      icon: Download,
    },
    {
      key: "multilingual",
      icon: Languages,
    },
    {
      key: "royalty",
      icon: Crown,
    },
    {
      key: "secure",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-border bg-muted/30 p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
