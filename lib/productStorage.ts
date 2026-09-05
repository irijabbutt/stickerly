import { Product } from './products';

const STORAGE_KEY = 'stickerly-admin-products';

export interface AdminProductInput {
  gumroadUrl: string;
  category: Product['category'];
  image: string;
}

export interface GumroadMetadata {
  title: string;
  description: string;
  priceUSD: number;
  originalPriceUSD?: number;
  currency: string;
  image: string;
  tags: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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

export async function createAdminProduct(input: AdminProductInput): Promise<Product | null> {
  const parsed = parseGumroadUrl(input.gumroadUrl);
  if (!parsed) return null;

  const metadata = await fetchGumroadMetadata(input.gumroadUrl);
  const displayName = metadata.title || parsed.productId;
  const id = slugify(displayName);

  const product: Product & { isAdmin: boolean } = {
    id,
    slug: id,
    nameKey: `admin.${id}.name`,
    descriptionKey: `admin.${id}.description`,
    name: displayName,
    description: metadata.description,
    priceUSD: metadata.priceUSD,
    originalPriceUSD: metadata.originalPriceUSD,
    gumroadProductId: parsed.productId,
    gumroadSeller: parsed.seller,
    category: input.category,
    image: input.image || metadata.image || '/products/kawaii-animals.svg',
    tags: metadata.tags.length > 0 ? metadata.tags : ['digital', input.category],
    isPack: true,
    isAdmin: true,
  };

  const existing = getAdminProducts();
  const updated = [...existing.filter((p) => p.id !== product.id), product];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
