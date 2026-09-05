"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("testimonials");

  const quotes = [
    { quote: "quote1", author: "author1" },
    { quote: "quote2", author: "author2" },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {quotes.map(({ quote, author }, i) => (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-border bg-muted/30 p-8"
            >
              <Quote className="h-8 w-8 text-primary" />
              <p className="mt-4 text-lg leading-relaxed">{t(quote)}</p>
              <p className="mt-6 text-sm font-semibold text-muted-foreground">
                — {t(author)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
