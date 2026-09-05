import { Product } from "./products";

function getGumroadProductId(product: Product): string {
  const envKey =
    "NEXT_PUBLIC_GUMROAD_PRODUCT_ID_" +
    product.slug.replace(/-/g, "_").toUpperCase();
  return process.env[envKey] || product.gumroadProductId;
}

/**
 * Build a direct Gumroad product page URL for a single product.
 *
 * Override real Gumroad IDs without touching code by setting environment
 * variables like NEXT_PUBLIC_GUMROAD_PRODUCT_ID_CUTE_STICKER_PACK.
 */
export function buildGumroadProductUrl(product: Product): string {
  return `https://gumroad.com/l/${getGumroadProductId(product)}`;
}

/**
 * Build a Gumroad checkout URL for the given products.
 * Gumroad supports multiple products in one checkout via repeated
 * `product_ids` query parameters on /checkout.
 *
 * Override real Gumroad IDs without touching code by setting environment
 * variables like NEXT_PUBLIC_GUMROAD_PRODUCT_ID_CUTE_STICKER_PACK.
 * Your Gumroad product ID is the slug/permalink from your product URL:
 * https://gumroad.com/l/YOUR_PRODUCT_ID -> "YOUR_PRODUCT_ID"
 */
export function buildGumroadCartUrl(
  items: { product: Product; quantity: number }[],
): string {
  if (items.length === 0) return "https://gumroad.com/discover";

  const base = "https://gumroad.com/checkout";
  const params = new URLSearchParams();

  items.forEach(({ product, quantity }) => {
    const gumroadId = getGumroadProductId(product);
    for (let i = 0; i < quantity; i++) {
      params.append("product_ids", gumroadId);
    }
  });

  return `${base}?${params.toString()}`;
}
