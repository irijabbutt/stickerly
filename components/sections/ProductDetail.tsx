"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Product, getProductName, getProductDescription } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";

interface ProductDetailProps {
  product: Product;
  locale: string;
  related: Product[];
}

export function ProductDetail({ product, locale, related }: ProductDetailProps) {
  const t = useTranslations("products");

  const productName = getProductName(product, t);
  const productDesc = getProductDescription(product, t);

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/#products`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToProducts")}
        </Link>

        {/* lg:items-start prevents image card from stretching to match long text */}
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          
          {/* Image Container Card */}
          <div className="lg:sticky lg:top-24 flex items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/20 p-4 shadow-sm">
            <img
              src={product.images?.[0] || product.image}
              alt={productName}
              className="max-h-[550px] w-full rounded-2xl object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <span className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {productName}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              {product.originalPriceUSD && product.originalPriceUSD > product.priceUSD && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPriceUSD.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-extrabold text-primary">
                ${product.priceUSD.toFixed(2)}
              </span>
            </div>

            {/* Formatted Description */}
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed mt-6 space-y-4"
              dangerouslySetInnerHTML={{ __html: productDesc }}
            />

            <div className="mt-8 flex gap-4">
              {isGumroadProductReady(product) ? (
                <a
                  href={buildGumroadProductUrl(product, { wanted: true }) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background hover:opacity-90 transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t("buyNow")}
                </a>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed rounded-full border border-border bg-muted/50 px-6 py-3 font-medium text-muted-foreground"
                >
                  {t("comingSoon")}
                </button>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
