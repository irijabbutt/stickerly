"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { getAdminProducts } from "@/lib/productStorage";
import type { Product } from "@/lib/products";

interface ReviewSummary {
  average: number;
  total: number;
  products: Product[];
}

function useAdminReviewSummary(): ReviewSummary | null {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminProducts().then((products) => {
      if (cancelled) return;
      const rated = products.filter(
        (p): p is Product & { ratingValue: number; reviewCount: number } =>
          typeof p.ratingValue === "number" && typeof p.reviewCount === "number" && p.reviewCount > 0
      );

      if (rated.length === 0) {
        setSummary(null);
        return;
      }

      const totalReviews = rated.reduce((sum, p) => sum + p.reviewCount, 0);
      const average =
        totalReviews > 0
          ? rated.reduce((sum, p) => sum + p.ratingValue * p.reviewCount, 0) / totalReviews
          : 0;

      setSummary({
        average: Math.round(average * 10) / 10,
        total: totalReviews,
        products: rated,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return summary;
}

function StarRating({ value }: { value: number }) {
  const fullStars = Math.floor(value);
  const partial = value - fullStars;

  return (
    <div className="flex items-center" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <div key={i} className="relative h-5 w-5">
            <Star className="absolute inset-0 h-5 w-5 text-muted" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="h-5 w-5 fill-primary text-primary" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const reviewSummary = useAdminReviewSummary();

  const quotes = [
    { quote: "quote1", author: "author1" },
    { quote: "quote2", author: "author2" },
  ];

  const cards = reviewSummary
    ? [
        {
          type: "rating" as const,
          rating: reviewSummary.average,
          count: reviewSummary.total,
        },
        ...quotes.map((q) => ({ type: "quote" as const, ...q })),
      ]
    : quotes.map((q) => ({ type: "quote" as const, ...q }));

  return (
    <section className="cv-auto py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.type === "rating" ? "gumroad-rating" : card.quote}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-border bg-muted/30 p-8"
            >
              {card.type === "rating" ? (
                <>
                  <StarRating value={card.rating} />
                  <p className="mt-4 text-2xl font-bold">
                    {card.rating} {t("outOf")} 5
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("basedOn", { count: card.count })}
                  </p>
                </>
              ) : (
                <>
                  <Quote className="h-8 w-8 text-primary" />
                  <p className="mt-4 text-lg leading-relaxed">{t(card.quote)}</p>
                  <p className="mt-6 text-sm font-semibold text-muted-foreground">
                    — {t(card.author)}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
