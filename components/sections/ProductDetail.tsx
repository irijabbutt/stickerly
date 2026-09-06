"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, getProductName, getProductDescription, getProductTagline } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";

function ProductImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  const showArrows = images.length > 1;
  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-4">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted to-background p-0">
        <img
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          className="h-full w-full object-cover"
          loading="eager"
        />
        {showArrows && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur-sm hover:bg-background transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur-sm hover:bg-background transition"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((src, idx) => (
            <button
              key={`${src.slice(0, 24)}-${idx}`}
              onClick={() => setActive(idx)}
              className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted p-0 transition ${
                active === idx
                  ? "border-primary ring-2 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${alt} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function categoryLabel(
  category: Product["category"],
  t: ReturnType<typeof useTranslations>
) {
  if (category === "3d") return "3D";
  return category === "animated" ? t("filterAnimated") : t("filterStickers");
}

export function ProductDetail({
  product,
  locale,
  related,
}: {
  product: Product;
  locale: string;
  related: Product[];
}) {
  const t = useTranslations("products");
  const tc = useTranslations("cart");

  const name = getProductName(product, t);
  const description = getProductDescription(product, t);

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

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductImageGallery images={product.images?.length ? product.images : [product.image]} alt={name} />

          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary capitalize">
              {categoryLabel(product.category, t)}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {name}
            </h1>
            <div className="mt-6 flex items-center gap-3">
              {product.originalPriceUSD && product.originalPriceUSD > product.priceUSD ? (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPriceUSD.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    ${product.priceUSD.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">${product.priceUSD.toFixed(2)}</span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isGumroadProductReady(product) ? (
                <a
                  href={buildGumroadProductUrl(product, { wanted: true }) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-base font-medium text-background hover:opacity-90 transition"
                >
                  <ExternalLink className="h-5 w-5" />
                  {tc("checkout")}
                </a>
              ) : (
                <span className="inline-flex w-full sm:w-auto cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-muted/50 px-8 py-3.5 text-base font-medium text-muted-foreground">
                  {t("comingSoon")}
                </span>
              )}
            </div>

            <div
              className="catalog-description mt-8 text-lg text-muted-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {product.tags.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium">{t("tags")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("relatedTitle")}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/products/${p.slug}/`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-background p-0">
                    <img
                      src={p.images?.[0] || p.image}
                      alt={getProductName(p, t)}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{getProductName(p, t)}</h3>
                      <div className="flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                        {p.originalPriceUSD && p.originalPriceUSD > p.priceUSD ? (
                          <>
                            <span className="text-xs text-muted-foreground line-through">
                              ${p.originalPriceUSD.toFixed(2)}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              ${p.priceUSD.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-primary">
                            ${p.priceUSD.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {getProductTagline(p, t)}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                      {t("viewDetails")} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
