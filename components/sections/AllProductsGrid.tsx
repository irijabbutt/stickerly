"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Product, ProductCategory, getProductName, getProductTagline } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";

export function AllProductsGrid({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const locale = useLocale();
  const [filter, setFilter] = useState<ProductCategory | "all">("all");

  const filters: { key: ProductCategory | "all"; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "stickers", label: t("filterStickers") },
    { key: "animated", label: t("filterAnimated") },
    { key: "3d", label: t("filter3d") },
  ];

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("allProducts.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("allProducts.subtitle")}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
                filter === f.key
                  ? "bg-foreground text-background"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:shadow-lg"
              >
                <Link
                  href={`/${locale}/products/${product.slug}/`}
                  className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-background transition hover:opacity-90"
                >
                  <Image
                    src={product.images?.[0] || product.image}
                    alt={getProductName(product, t, locale)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="eager"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  {product.comingSoon && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                      {t("comingSoon")}
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/${locale}/products/${product.slug}/`}>
                      <h3 className="text-base font-semibold hover:underline line-clamp-1">
                        {getProductName(product, t, locale)}
                      </h3>
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
                  <div className="mt-5 grid grid-cols-2 gap-2">
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
          </div>
        )}
      </div>
    </section>
  );
}
