// lib/gumroad.ts
import { Product } from './products';

function getGumroadEnvKey(product: Product): string {
  return 'NEXT_PUBLIC_GUMROAD_PRODUCT_ID_' + product.slug.replace(/-/g, '_').toUpperCase();
}

function getGumroadProductId(product: Product): string {
  return process.env[getGumroadEnvKey(product)] || product.gumroadProductId;
}

function isConfiguredId(id: string): boolean {
  return Boolean(id && id.trim());
}

/**
 * Returns true when the product has a Gumroad product ID at all. Since the
 * catalog is admin-only now, every product's ID/slug came straight from a
 * real rijabai.gumroad.com/l/SLUG URL entered in /admin (see
 * parseGumroadUrl in lib/productStorage.ts), so there's no placeholder list
 * to guard against anymore.
 */
export function isGumroadProductReady(product: Product): boolean {
  return isConfiguredId(getGumroadProductId(product));
}

export function isGumroadCartReady(
  items: { product: Product; quantity: number }[],
): boolean {
  return items.length > 0 && items.every(({ product }) => isGumroadProductReady(product));
}

function buildSellerProductUrl(product: Product, id: string): string {
  if (product.gumroadSeller) {
    return 'https://' + product.gumroadSeller + '.gumroad.com/l/' + id;
  }
  return 'https://gumroad.com/l/' + id;
}

export function buildGumroadProductUrl(
  product: Product,
  options?: { wanted?: boolean },
): string | null {
  const id = getGumroadProductId(product);
  if (!isConfiguredId(id)) return null;

  const url = new URL(buildSellerProductUrl(product, id));
  if (options?.wanted) {
    url.searchParams.set('wanted', 'true');
  }
  return url.toString();
}

/**
 * Build a Gumroad checkout URL for the given cart items.
 *
 * Gumroad has no official multi-product checkout endpoint — this groups
 * items by gumroadSeller and builds a single seller's checkout URL with
 * repeated product_ids params. If the cart spans more than one seller,
 * only the first seller's group is included and `splitBySeller` is set so
 * the UI can warn the customer instead of silently dropping items.
 */
export interface GumroadCartResult {
  url: string | null;
  splitBySeller: boolean;
}

export function buildGumroadCartUrl(
  items: { product: Product; quantity: number }[],
): GumroadCartResult {
  if (items.length === 0) {
    return { url: 'https://gumroad.com/discover', splitBySeller: false };
  }
  if (!isGumroadCartReady(items)) {
    return { url: null, splitBySeller: false };
  }

  const bySeller = new Map<string, { product: Product; quantity: number }[]>();
  items.forEach((item) => {
    const key = item.product.gumroadSeller || '__none__';
    bySeller.set(key, [...(bySeller.get(key) || []), item]);
  });

  const groups = Array.from(bySeller.entries());
  const [firstSellerKey, firstGroupItems] = groups[0];

  const base =
    firstSellerKey === '__none__'
      ? 'https://gumroad.com/checkout'
      : `https://${firstSellerKey}.gumroad.com/checkout`;

  const params = new URLSearchParams();
  firstGroupItems.forEach(({ product, quantity }) => {
    const gumroadId = getGumroadProductId(product);
    for (let i = 0; i < quantity; i++) {
      params.append('product_ids', gumroadId);
    }
  });

  return {
    url: `${base}?${params.toString()}`,
    splitBySeller: groups.length > 1,
  };
}
