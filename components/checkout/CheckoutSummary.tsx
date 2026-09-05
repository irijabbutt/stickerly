"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Minus, Plus, ShoppingBag, ArrowRight, Lock, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { buildGumroadCartUrl, isGumroadCartReady } from "@/lib/gumroad";

export function CheckoutSummary() {
  const t = useTranslations("checkout");
  const tp = useTranslations("products");
  const locale = useLocale();
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">{t("emptyTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("emptySubtitle")}</p>
          <Link
            href={`/${locale}/#products`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition"
          >
            {t("continueShopping")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const gumroadUrl = buildGumroadCartUrl(items);

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("summaryTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("summarySubtitle")}</p>

        <div className="mt-10 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm"
            >
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-muted p-2">
                <img
                  src={product.image}
                  alt={tp(product.nameKey)}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{tp(product.nameKey)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.priceUSD}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(product.priceUSD * quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="rounded-lg border border-border p-1.5 hover:bg-muted transition"
                      aria-label={t("quantity")}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="rounded-lg border border-border p-1.5 hover:bg-muted transition"
                      aria-label={t("quantity")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t("itemCount", { count: totalItems })}</span>
            <span>{t("subtotal")}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-2xl font-bold">
            <span>{t("total")}</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {isGumroadCartReady(items) && gumroadUrl ? (
            <a
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background hover:opacity-90 transition"
            >
              <Lock className="h-4 w-4" />
              {t("proceedToGumroad")}
            </a>
          ) : (
            <span className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-muted px-6 py-3 font-medium text-muted-foreground">
              <Lock className="h-4 w-4" />
              {t("comingSoon")}
            </span>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {isGumroadCartReady(items) ? t("secureNote") : t("notReadyNote")}
          </p>
        </div>

        <Link
          href={`/${locale}/#products`}
          className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          {t("continueShopping")}
        </Link>
      </div>
    </section>
  );
}
