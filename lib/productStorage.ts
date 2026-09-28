import { Product, ProductCategory } from './products';

export interface AdminProductInput {
  gumroadUrl: string;
  category: ProductCategory;
  image: string;
  images: string[];
  discountPercent?: number;
  comingSoon?: boolean;
}

export interface GumroadMetadata {
  title: string;
  description: string;
  priceUSD: number;
  originalPriceUSD?: number;
  currency: string;
  image: string;
  tags: string[];
  ratingValue?: number;
  reviewCount?: number;
}

function parseGumroadUrl(url: string): { seller?: string; productId: string } | null {
  try {
    const parsed = new URL(url);
    const hostParts = parsed.hostname.split('.');
    const pathMatch = parsed.pathname.match(/\/l\/([^/]+)/);
    if (!pathMatch) return null;
    const productId = pathMatch[1];
    const seller = hostParts.length >= 3 && hostParts[1] === 'gumroad' ? hostParts[0] : undefined;
    return { seller, productId };
  } catch {
    return null;
  }
}

export async function fetchGumroadMetadata(url: string): Promise<GumroadMetadata> {
  const response = await fetch('/api/gumroad', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch Gumroad metadata (${response.status})`);
  }

  return response.json();
}

/**
 * Creates a product by writing it to Supabase (via the admin API, which checks
 * the signed session cookie and uses the service role key server-side). The
 * product is instantly visible to every visitor, on every device.
 */
export async function createAdminProduct(input: AdminProductInput): Promise<Product | null> {
  const parsed = parseGumroadUrl(input.gumroadUrl);
  if (!parsed) return null;

  const metadata = await fetchGumroadMetadata(input.gumroadUrl);
  const displayName = metadata.title || parsed.productId;
  const slug = parsed.productId;

  const discountPercent = Math.max(0, Math.min(100, input.discountPercent || 0));
  const originalPrice = metadata.priceUSD;
  const discountedPrice =
    discountPercent > 0
      ? Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100
      : originalPrice;

  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      slug,
      name: displayName,
      description: metadata.description || '',
      priceUSD: discountedPrice,
      originalPriceUSD: discountPercent > 0 ? originalPrice : undefined,
      category: input.category,
      image: input.images[0] || '',
      images: input.images,
      tags: metadata.tags.length > 0 ? metadata.tags : ['digital', input.category],
      isPack: true,
      comingSoon: input.comingSoon,
      gumroadProductId: parsed.productId,
      gumroadSeller: parsed.seller,
      ratingValue: metadata.ratingValue,
      reviewCount: metadata.reviewCount,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Failed to save product (${response.status})`);
  }

  return response.json();
}

export async function getAdminProducts(): Promise<Product[]> {
  const response = await fetch('/api/products', { cache: 'no-store' });
  if (!response.ok) return [];
  return response.json();
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const response = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete product (${response.status})`);
  }
}

export interface TranslateMissingResult {
  translated: number;
  failed: number;
  skipped: number;
  remaining?: number;
  errors?: string[];
}

/** Translates every product that has no stored translations yet (admin only). */
export async function translateMissingProducts(force = false): Promise<TranslateMissingResult> {
  const response = await fetch(`/api/admin/translate-missing${force ? '?force=1' : ''}`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Translation failed (${response.status})`);
  return data as TranslateMissingResult;
}
