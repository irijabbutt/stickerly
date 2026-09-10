"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, getProductName, getProductDescription } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";

interface ProductDetailProps {
  product: Product;
  locale: string;
  related: Product[];
}

export function ProductDetail({ product, locale, related }: ProductDetailProps) {
  const t = useTranslations("products");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productName = getProductName(product, t);
  const productDesc = getProductDescription(product, t);

  // Combine image array with main image fallback
  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

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
          {/* Image Container Card with Navigation Controls */}
          <div className="relative lg:sticky lg:top-24 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/20 p-4 shadow-sm group">
            <img
              src={allImages[currentImageIndex]}
              alt={`${productName} - Image ${currentImageIndex + 1}`}
              className="max-h-[550px] w-full rounded-2xl object-contain transition-all duration-300"
            />

            {/* Render Navigation Arrows if product has multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous Image"
                  className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2.5 text-foreground shadow-md backdrop-blur-md hover:bg-background transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={handleNextImage}
                  aria-label="Next Image"
                  className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2.5 text-foreground shadow-md backdrop-blur-md hover:bg-background transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Counter Badge */}
                <div className="absolute top-6 right-6 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>

                {/* Dot Indicators */}
                <div className="mt-4 flex gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "w-6 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
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

            {/* Buy Now Button - Positioned immediately below Price & Title */}
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

            {/* Formatted Description */}
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed mt-8 pt-6 border-t border-border space-y-4"
              dangerouslySetInnerHTML={{ __html: productDesc }}
            />

            {/* Tags with locale fallback */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => {
                    let displayTag = tag;
                    try {
                      const key = `tags.${tag.toLowerCase().replace(/\s+/g, "_")}`;
                      const translated = t(key);
                      if (translated && translated !== key) displayTag = translated;
                    } catch {}
            
                    return (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {displayTag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
