"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function CTABanner() {
  const t = useTranslations("ctaBanner");
  const locale = useLocale();

  // Scroll straight to the products section when it's on this page; if it isn't
  // (e.g. the banner is shown on another page), fall through to normal navigation.
  const goToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("products");
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/${locale}/#products`);
  };

  return (
    <section className="cv-auto py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-accent px-8 py-16 text-center text-primary-foreground lg:px-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg opacity-90">{t("subtitle")}</p>
          <Link
            href={`/${locale}/#products`}
            onClick={goToProducts}
            className="mt-8 inline-flex items-center rounded-full bg-primary-foreground px-8 py-3 text-base font-semibold text-primary hover:opacity-90 transition"
          >
            {t("button")}
          </Link>
          <div className="mt-4">
            <a
              href="https://rijabai.gumroad.com/affiliates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition"
            >
              <ExternalLink className="h-4 w-4" />
              {t("affiliate")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
