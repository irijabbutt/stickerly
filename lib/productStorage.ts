import { Product } from './products';

const STORAGE_KEY = 'stickerly-admin-products';

export interface AdminProductInput {
  name: string;
  description: string;
  priceUSD: number;
  gumroadUrl: string;
  category: Product['category'];
  image: string;
  tags: string;
  isPack: boolean;
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
    // Supported formats:
    // https://seller.gumroad.com/l/PRODUCT_ID
    // https://gumroad.com/l/PRODUCT_ID
    const pathMatch = parsed.pathname.match(/\/l\/([^/]+)/);
    if (!pathMatch) return null;
    const productId = pathMatch[1];
    const seller = hostParts.length >= 3 && hostParts[1] === 'gumroad' ? hostParts[0] : undefined;
    return { seller, productId };
  } catch {
    return null;
  }
}

export function createAdminProduct(input: AdminProductInput): Product | null {
  const parsed = parseGumroadUrl(input.gumroadUrl);
  if (!parsed) return null;

  const id = slugify(input.name);
  const product: Product & { isAdmin: boolean } = {
    id,
    slug: id,
    nameKey: `admin.${id}.name`,
    descriptionKey: `admin.${id}.description`,
    name: input.name,
    description: input.description,
    priceUSD: input.priceUSD,
    gumroadProductId: parsed.productId,
    gumroadSeller: parsed.seller,
    category: input.category,
    image: input.image || '/products/kawaii-animals.svg',
    tags: input.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    isPack: input.isPack,
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
