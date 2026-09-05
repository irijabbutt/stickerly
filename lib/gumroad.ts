import { Product } from './products';

// These slugs are intentionally used as placeholders in the starter template.
// They currently resolve to other creators' Gumroad products, so any URL built
// from them must be treated as unsafe until real IDs are configured.
const PLACEHOLDER_GUMROAD_IDS = new Set([
  'cute-sticker-pack',
  'motion-ui-kit',
  '3d-icon-scene',
  'kawaii-animals',
  'loader-collection',
  'floating-shapes',
]);

function getGumroadEnvKey(product: Product): string {
  return 'NEXT_PUBLIC_GUMROAD_PRODUCT_ID_' + product.slug.replace(/-/g, '_').toUpperCase();
}

function getGumroadProductId(product: Product): string {
  return process.env[getGumroadEnvKey(product)] || product.gumroadProductId;
}

function isConfiguredId(id: string): boolean {
  return Boolean(id) && !PLACEHOLDER_GUMROAD_IDS.has(id);
}

/**
 * Returns true when the product has a real Gumroad product ID configured.
 * Placeholder IDs are rejected so the UI does not accidentally link to
 * another seller's products.
 */
export function isGumroadProductReady(product: Product): boolean {
  return isConfiguredId(getGumroadProductId(product));
}

/**
 * Returns true when every item in the cart has a real Gumroad product ID.
 */
export function isGumroadCartReady(
  items: { product: Product; quantity: number }[],
): boolean {
  return items.length > 0 && items.every(({ product }) => isGumroadProductReady(product));
}

/**
 * Build a direct Gumroad product page URL for a single product.
 *
 * Override real Gumroad IDs without touching code by setting environment
 * variables like NEXT_PUBLIC_GUMROAD_PRODUCT_ID_CUTE_STICKER_PACK.
 *
 * Returns null when the resolved ID is a placeholder, so callers can disable
 * or hide the buy button instead of linking to the wrong product.
 */
export function buildGumroadProductUrl(product: Product): string | null {
  const id = getGumroadProductId(product);
  if (!isConfiguredId(id)) return null;
  return 'https://gumroad.com/l/' + id;
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
 *
 * Returns null when any item still uses a placeholder ID.
 */
export function buildGumroadCartUrl(
  items: { product: Product; quantity: number }[],
): string | null {
  if (items.length === 0) return 'https://gumroad.com/discover';
  if (!isGumroadCartReady(items)) return null;

  const base = 'https://gumroad.com/checkout';
  const params = new URLSearchParams();

  items.forEach(({ product, quantity }) => {
    const gumroadId = getGumroadProductId(product);
    for (let i = 0; i < quantity; i++) {
      params.append('product_ids', gumroadId);
    }
  });

  return base + '?' + params.toString();
}