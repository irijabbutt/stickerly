"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/products";

/**
 * Fetches the live product catalog from Supabase (via /api/products), so every
 * visitor sees the same admin-managed catalog instead of per-browser localStorage.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}

export function useProductBySlug(slug: string): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.slug === slug);
}
