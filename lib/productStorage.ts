import { Product } from './products';

const STORAGE_KEY = 'stickerly-admin-products';
const LOCALES = ['ur', 'ko', 'ja', 'zh'] as const;

export interface AdminProductInput {
  gumroadUrl: string;
  category: Product['category'];
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

async function translateProductLocales(name: string, description: string) {
  const translations: Record<string, { name: string; description: string }> = {};

  await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, locale }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.name && data.description) {
            translations[locale] = {
              name: data.name,
              description: data.description,
            };
          }
        }
      } catch {}
    })
  );

  return translations;
}

export async function createAdminProduct(input: AdminProductInput): Promise<Product | null> {
  const parsed = parseGumroadUrl(input.gumroadUrl);
  if (!parsed) return null;

  const metadata = await fetchGumroadMetadata(input.gumroadUrl);
  const displayName = metadata.title || parsed.productId;
  const id = parsed.productId;

  const discountPercent = Math.max(0, Math.min(100, input.discountPercent || 0));
  const originalPrice = metadata.priceUSD;
  const discountedPrice =
    discountPercent > 0
      ? Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100
      : originalPrice;

  // Automatically fetch translations for all locales upon creation
  const translations = await translateProductLocales(displayName, metadata.description || '');

  const product: Product & { isAdmin: boolean } = {
    id,
    slug: id,
    nameKey: `products.admin.${id}.name`,
    descriptionKey: `products.admin.${id}.description`,
    name: displayName,
    description: metadata.description,
    priceUSD: discountedPrice,
    originalPriceUSD: discountPercent > 0 ? originalPrice : undefined,
    gumroadProductId: parsed.productId,
    gumroadSeller: parsed.seller,
    category: input.category,
    image: input.images[0] || input.image || metadata.image || '/products/kawaii-animals.svg',
    images: input.images.length > 0 ? input.images : undefined,
    ratingValue: metadata.ratingValue,
    reviewCount: metadata.reviewCount,
    tags: metadata.tags.length > 0 ? metadata.tags : ['digital', input.category],
    isPack: true,
    isAdmin: true,
    comingSoon: input.comingSoon,
    translations,
  };

  const existing = getAdminProducts();
  const updated = [...existing.filter((p) => p.id !== product.id), product];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Storage failed';
    throw new Error(`Failed to save product. Images may be too large for browser storage. ${message}`);
  }
  return product;
}

export function getAdminProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteAdminProduct(id: string): void {
  const updated = getAdminProducts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
