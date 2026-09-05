"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ExternalLink, Minus, Plus } from "lucide-react";
import { Product, getProductName, getProductDescription, getProductTagline } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";
import { useCart } from "@/components/cart/CartContext";

function ProductImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted to-background p-8 lg:p-12">
        <img
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          className="h-full w-full object-contain"
          loading="eager"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((src, idx) => (
            <button
              key={`${src.slice(0, 24)}-${idx}`}
              onClick={() => setActive(idx)}
              className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted p-2 transition ${
                active === idx
                  ? "border-primary ring-2 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${alt} thumbnail ${idx + 1}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function categoryEmoji(category: Product["category"]) {
  if (category === "stickers") return "🌟";
  if (category === "animated") return "✨";
  return "🧊";
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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const adjust = (delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

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
            <div
              className="catalog-description mt-4 text-lg text-muted-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: description }}
            />
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

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {tc("quantity")}
              </span>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
                <button
                  onClick={() => adjust(-1)}
                  className="rounded-full p-1 hover:bg-muted transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => adjust(1)}
                  className="rounded-full p-1 hover:bg-muted transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdd}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background hover:opacity-90 transition"
              >
                <ShoppingCart className="h-4 w-4" />
                {added ? t("added") : t("addToCart")}
              </button>
              {isGumroadProductReady(product) ? (
                <a
                  href={buildGumroadProductUrl(product, { wanted: true }) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-muted transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  {tc("checkout")}
                </a>
              ) : (
                <span className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-muted/50 px-6 py-3 font-medium text-muted-foreground">
                  {t("comingSoon")}
                </span>
              )}
            </div>

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
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-muted to-background p-6 text-5xl">
                    <img
                      src={p.images?.[0] || p.image}
                      alt={getProductName(p, t)}
                      className="h-full w-full object-contain"
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
