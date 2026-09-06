"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Product, getProductName, getProductTagline } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";

export function CategoryGrid({
  categoryKey,
}: {
  categoryKey: "stickers" | "animated" | "3d";
}) {
  const t = useTranslations("products");
  const tc = useTranslations("categories");
  const locale = useLocale();
  const products = useProducts().filter((p) => p.category === categoryKey);

  const headline = tc(`${categoryKey}.headline`);
  const subheadline = tc(`${categoryKey}.subheadline`);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/#products`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc("viewAll")}
        </Link>

        <div className="mt-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{subheadline}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:shadow-lg"
            >
              <Link
                href={`/${locale}/products/${product.slug}/`}
                className="flex h-48 items-center justify-center bg-gradient-to-br from-muted to-background p-6 transition hover:opacity-90"
              >
                <img
                  src={product.images?.[0] || product.image}
                  alt={getProductName(product, t)}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/${locale}/products/${product.slug}/`}>
                    <h2 className="text-lg font-semibold hover:underline">
                      {getProductName(product, t)}
                    </h2>
                  </Link>
                  <div className="flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                    {product.originalPriceUSD && product.originalPriceUSD > product.priceUSD ? (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          ${product.originalPriceUSD.toFixed(2)}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          ${product.priceUSD.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-primary">
                        ${product.priceUSD.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {getProductTagline(product, t)}
                </p>
                
                {/* Updated Button Layout */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Link
                    href={`/${locale}/products/${product.slug}/`}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
                  >
                    {t("viewDetails")}
                  </Link>
                  {isGumroadProductReady(product) ? (
                    <a
                      href={buildGumroadProductUrl(product, { wanted: true }) ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90 transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("buyNow")}
                    </a>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center justify-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
                      {t("comingSoon")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {products.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
