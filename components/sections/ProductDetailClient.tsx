"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductDetail } from "./ProductDetail";

function LoadingSkeleton() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-12 w-48 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductDetailClient({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations("products");
  const products = useProducts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = products.find((p) => p.slug === slug);
  const related = product
    ? products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 3)
    : [];

  if (!mounted) {
    return <LoadingSkeleton />;
  }

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
