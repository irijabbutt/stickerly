"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ExternalLink } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";

function categoryEmoji(category: Product["category"]) {
  if (category === "stickers") return "🌟";
  if (category === "animated") return "✨";
  return "🧊";
}

export function ProductDetail({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const t = useTranslations("products");
  const tc = useTranslations("cart");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/#products`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("filterAll")}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex aspect-square items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-muted to-background text-8xl lg:text-9xl">
            {categoryEmoji(product.category)}
          </div>

          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary capitalize">
              {product.category === "3d"
                ? "3D"
                : t(
                    product.category === "animated"
                      ? "filterAnimated"
                      : "filterStickers"
                  )}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t(product.nameKey)}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t(product.descriptionKey)}
            </p>
            <p className="mt-6 text-3xl font-bold">${product.priceUSD}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdd}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background hover:opacity-90 transition"
              >
                <ShoppingCart className="h-4 w-4" />
                {added ? t("added") : t("addToCart")}
              </button>
              <a
                href={`https://gumroad.com/l/${product.gumroadProductId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-medium hover:bg-muted transition"
              >
                <ExternalLink className="h-4 w-4" />
                {tc("checkout")}
              </a>
            </div>

            {product.tags.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium">{t("tags") || "Tags"}</p>
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
      </div>
    </section>
  );
}
