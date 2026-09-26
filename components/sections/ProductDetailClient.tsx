"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/lib/products";
import { ProductDetail } from "./ProductDetail";

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product | null;
  related: Product[];
}) {
  const locale = useLocale();
  const t = useTranslations("products");

  if (!product) {
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
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold">{t("empty")}</h1>
            <Link
              href={`/${locale}/#products`}
              className="mt-4 inline-block text-primary hover:underline"
            >
              {t("backToProducts")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <ProductDetail product={product} locale={locale} related={related} />;
}
