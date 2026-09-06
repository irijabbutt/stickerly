"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { getProductName } from "@/lib/products";
import { buildGumroadCartUrl } from "@/lib/gumroad";

export function CheckoutSummary() {
  const t = useTranslations("checkout");
  const tp = useTranslations("products");
  const tc = useTranslations("cart");
  const locale = useLocale();
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  const gumroadUrl = buildGumroadCartUrl(items);

  const handleGumroadCheckout = () => {
    if (gumroadUrl) {
      window.location.href = gumroadUrl;
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">{t("emptyTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("emptyDescription")}</p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc("browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("description")}
      </p>

      {/* Cart Items List */}
      <div className="mt-8 space-y-4">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-background/80 p-4 backdrop-blur-md"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted p-2">
              <img
                src={product.images?.[0] || product.image}
                alt={getProductName(product, tp)}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {getProductName(product, tp)}
              </h3>
              <p className="text-sm text-muted-foreground">
                ${product.priceUSD.toFixed(2)}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="rounded-lg border border-border p-1 hover:bg-muted transition"
                  aria-label={tc("quantity")}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="rounded-lg border border-border p-1 hover:bg-muted transition"
                  aria-label={tc("quantity")}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between self-stretch">
              <button
                onClick={() => removeItem(product.id)}
                className="text-muted-foreground hover:text-destructive transition"
                aria-label={tc("remove")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <p className="font-bold text-foreground">
                ${(product.priceUSD * quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box & Redirect CTA */}
      <div className="mt-8 rounded-2xl border border-border bg-background/80 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>{tc("subtotal")} ({totalItems} items)</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={handleGumroadCheckout}
          disabled={!gumroadUrl}
          className="flex w-full items-center justify-center rounded-full bg-foreground py-4 text-center font-semibold text-background hover:opacity-90 transition disabled:opacity-50"
        >
          🔒 {t("continueToGumroad")}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          {t("redirectNotice")}
        </p>
      </div>
    </div>
  );
}
