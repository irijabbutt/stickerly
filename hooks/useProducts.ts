"use client";

import { useEffect, useState } from "react";
import { products as staticProducts, Product } from "@/lib/products";
import { getAdminProducts } from "@/lib/productStorage";

export function useProducts(): Product[] {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);

  useEffect(() => {
    setAdminProducts(getAdminProducts());
  }, []);

  return [...staticProducts, ...adminProducts];
}

export function useProductBySlug(slug: string): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.slug === slug);
}
