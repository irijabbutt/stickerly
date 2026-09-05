"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Product, ProductCategory } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";

export function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filters: { key: ProductCategory | "all"; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "stickers", label: t("filterStickers") },
    { key: "animated", label: t("filterAnimated") },
    { key: "3d", label: t("filter3d") },
  ];

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const handleAdd = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="products" className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-foreground text-background"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:shadow-lg"
              >
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-muted to-background text-5xl">
                  {product.category === "stickers" && "🌟"}
                  {product.category === "animated" && "✨"}
                  {product.category === "3d" && "🧊"}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">
                      {t(`${product.nameKey}`)}
                    </h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      ${product.priceUSD}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {t(`${product.descriptionKey}`)}
                  </p>
                  <button
                    onClick={() => handleAdd(product)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 transition"
                  >
                    {addedId === product.id ? (
                      <>
                        <Check className="h-4 w-4" /> {t("added")}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" /> {t("addToCart")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
