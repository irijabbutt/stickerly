"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { getProductName } from "@/lib/products";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const t = useTranslations("cart");
  const tp = useTranslations("products");
  const locale = useLocale();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        className="fixed end-0 top-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col sm:end-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:h-auto sm:max-h-[80vh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 hover:bg-muted transition"
            aria-label={t("continue")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("empty")}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-primary font-medium hover:underline"
            >
              {t("browse")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-border p-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-muted p-2">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={getProductName(product, tp)}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {getProductName(product, tp)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.originalPriceUSD && product.originalPriceUSD > product.priceUSD ? (
                        <>
                          <span className="line-through">
                            ${product.originalPriceUSD.toFixed(2)}
                          </span>{" "}
                          <span className="font-semibold text-primary">
                            ${product.priceUSD.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>${product.priceUSD.toFixed(2)}</>
                      )}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        className="rounded-lg border border-border p-1 hover:bg-muted transition"
                        aria-label={t("quantity")}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1)
                        }
                        className="rounded-lg border border-border p-1 hover:bg-muted transition"
                        aria-label={t("quantity")}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="self-start text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("remove")}
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>{t("subtotal")}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Link
                href={`/${locale}/checkout/`}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-background font-medium hover:opacity-90 transition"
              >
                {t("checkout")}
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                {t("continue")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
