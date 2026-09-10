import { useState, useEffect } from "react";
import { Product, getProductName, getProductDescription } from "@/lib/products";

export function useDynamicTranslation(product: Product | undefined, locale: string, t: any) {
  const staticName = product ? getProductName(product, t) : "";
  const staticDesc = product ? getProductDescription(product, t) : "";

  const [translatedName, setTranslatedName] = useState<string>(staticName);
  const [translatedDesc, setTranslatedDesc] = useState<string>(staticDesc);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!product) return;

    const name = getProductName(product, t);
    const desc = getProductDescription(product, t);

    setTranslatedName(name);
    setTranslatedDesc(desc);

    const isMissingTranslation =
      locale !== "en" &&
      (name === product.name ||
        name.startsWith("products.admin") ||
        desc.startsWith("products.admin"));

    if (isMissingTranslation) {
      setLoading(true);
      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name || name,
          description: product.description || desc,
          locale,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.name) setTranslatedName(data.name);
          if (data.description) setTranslatedDesc(data.description);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [product?.id, locale]);

  return {
    productName: translatedName || staticName,
    productDesc: translatedDesc || staticDesc,
    loadingTranslation: loading,
  };
}
