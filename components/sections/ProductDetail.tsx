"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Product } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";

interface ProductDetailProps {
  product: Product;
  locale: string;
  related: Product[];
}

export function ProductDetail({ product, locale }: ProductDetailProps) {
  const t = useTranslations("products");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dynamic Translation fallback for runtime products
  const { productName, productDesc, loadingTranslation } = useDynamicTranslation(
    product,
    locale,
    t
  );

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

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

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Image Container Card */}
          <div className="relative lg:sticky lg:top-24 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/20 p-4 shadow-sm">
            <img
              src={allImages[currentImageIndex]}
              alt={productName}
              className="max-h-[550px] w-full rounded-2xl object-contain transition-all duration-300"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                  }
                  className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2.5 text-foreground backdrop-blur-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2.5 text-foreground backdrop-blur-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Product Metadata */}
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

            {/* Buy Now Button */}
            <div className="mt-6 flex gap-4">
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

            {/* Dynamic HTML Description */}
            <div className="mt-8 pt-6 border-t border-border">
              {loadingTranslation ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating details...
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: productDesc }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
