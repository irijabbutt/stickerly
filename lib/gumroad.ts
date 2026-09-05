import { Product } from "./products";

/**
 * Build a Gumroad checkout URL for the given products.
 * Gumroad supports multiple products in one checkout via the `product_ids`
 * query parameter on /checkout. Replace the placeholder IDs in
 * `lib/products.ts` with your real Gumroad offer/permalink IDs.
 *
 * Your Gumroad product ID is the slug/permalink from your product URL:
 * https://gumroad.com/l/YOUR_PRODUCT_ID -> "YOUR_PRODUCT_ID"
 */
export function buildGumroadCartUrl(items: { product: Product; quantity: number }[]): string {
  if (items.length === 0) return "https://gumroad.com/discover";

  const base = "https://gumroad.com/checkout";
  const params = new URLSearchParams();

  items.forEach(({ product, quantity }) => {
    for (let i = 0; i < quantity; i++) {
      params.append("product_ids", product.gumroadProductId);
    }
  });

  return `${base}?${params.toString()}`;
}
