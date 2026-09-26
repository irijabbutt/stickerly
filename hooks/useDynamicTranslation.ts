import { useState, useEffect } from "react";
import { Product, getProductName, getProductDescription } from "@/lib/products";

export function useDynamicTranslation(
  product: Product | undefined,
  locale: string,
  t: any
) {
  const getInitialName = () => {
    if (!product) return "";
    if (locale && product.translations?.[locale]?.name) {
      return product.translations[locale].name;
    }
    return getProductName(product, t);
  };

  const getInitialDesc = () => {
    if (!product) return "";
    if (locale && product.translations?.[locale]?.description) {
      return product.translations[locale].description;
    }
    return getProductDescription(product, t);
  };

  const [productName, setProductName] = useState(getInitialName);
  const [productDesc, setProductDesc] = useState(getInitialDesc);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  useEffect(() => {
    if (!product) return;

    // 1. Instant check for pre-calculated translations
    if (locale && product.translations?.[locale]) {
      setProductName(product.translations[locale].name);
      setProductDesc(product.translations[locale].description);
      setLoadingTranslation(false);
      return;
    }

    const currentName = getProductName(product, t);
    const currentDesc = getProductDescription(product, t);

    setProductName(currentName);
    setProductDesc(currentDesc);

    // 2. Skip API if locale is English or static json translations match
    if (
      locale === "en" ||
      (currentName !== product.name &&
        !currentName.startsWith("products.admin") &&
        !currentDesc.startsWith("products.admin"))
    ) {
      setLoadingTranslation(false);
      return;
    }

    // 3. Fallback to OpenRouter runtime translation endpoint
    setLoadingTranslation(true);
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name || currentName,
        description: product.description || currentDesc,
        locale,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setProductName(data.name);
        if (data.description) setProductDesc(data.description);
      })
      .catch(() => {})
      .finally(() => setLoadingTranslation(false));
  }, [product?.id, locale]);

  return { productName, productDesc, loadingTranslation };
}
