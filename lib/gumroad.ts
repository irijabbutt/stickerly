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
 * Safely extracts the product slug from a full Gumroad URL.
 * e.g., "https://username.gumroad.com/l/sticker1" -> "sticker1"
 */
export function extractGumroadSlug(gumroadUrl: string): string | null {
  try {
    const parsedUrl = new URL(gumroadUrl);
    
    // Splits the path and removes empty strings
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    
    // The slug is almost always the last segment in the URL path
    if (pathSegments.length > 0) {
      return pathSegments[pathSegments.length - 1];
    }
    
    return null;
  } catch (error) {
    console.error("Invalid Gumroad URL:", gumroadUrl);
    return null;
  }
}
