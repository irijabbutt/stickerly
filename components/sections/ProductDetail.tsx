"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ExternalLink, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/products";
import { buildGumroadProductUrl, isGumroadProductReady } from "@/lib/gumroad";
import { useCart } from "@/components/cart/CartContext";

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

  const name = t(product.nameKey);

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
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted to-background p-8 lg:p-12">
            <img
              src={product.image}
              alt={name}
              className="h-full w-full object-contain"
              loading="eager"
            />
          </div>

          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary capitalize">
              {categoryLabel(product.category, t)}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t(product.descriptionKey)}
            </p>
            <p className="mt-6 text-3xl font-bold">${product.priceUSD}</p>

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
                  href={buildGumroadProductUrl(product) ?? undefined}
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
                      src={p.image}
                      alt={t(p.nameKey)}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{t(p.nameKey)}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        ${p.priceUSD}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {t(p.descriptionKey)}
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
