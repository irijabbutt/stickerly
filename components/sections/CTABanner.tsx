"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";

export function CTABanner() {
  const t = useTranslations("ctaBanner");
  const { setIsOpen } = useCart();

  return (
    <section className="py-20 lg:py-28">
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
          <button
            onClick={() => setIsOpen(true)}
            className="mt-8 inline-flex items-center rounded-full bg-primary-foreground px-8 py-3 text-base font-semibold text-primary hover:opacity-90 transition"
          >
            {t("button")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
