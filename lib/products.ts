export type ProductCategory = 'stickers' | 'animated' | '3d';

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  name?: string;
  description?: string;
  priceUSD: number;
  originalPriceUSD?: number;
  images?: string[];
  ratingValue?: number;
  reviewCount?: number;
  gumroadProductId: string;
  gumroadSeller?: string;
  category: ProductCategory;
  image: string;
  tags: string[];
  isPack: boolean;
  isAdmin?: boolean;
  comingSoon?: boolean;
  translations?: Record<string, { name: string; description: string }>;
}

// Single definition containing your product objects:
export const products: Product[] = [
 
];

export type TranslateFn = (key: string) => string;

export function getProductName(product: Product, t: TranslateFn, locale?: string): string {
  if (!product) return "";

  // Check auto-generated translations stored in product object
  if (locale && product.translations?.[locale]?.name) {
    return product.translations[locale].name;
  }

  const relativeKey = product.nameKey?.replace(/^products\./, "") || "";

  try {
    const translated = t(relativeKey);
    if (
      translated &&
      translated !== relativeKey &&
      !translated.startsWith("products.admin") &&
      !translated.startsWith("admin.")
    ) {
      return translated;
    }
  } catch {}

  return product.name || product.nameKey;
}

export function getProductDescription(product: Product, t: TranslateFn, locale?: string): string {
  if (!product) return "";

  // Check auto-generated translations stored in product object
  if (locale && product.translations?.[locale]?.description) {
    return product.translations[locale].description;
  }

  const relativeKey = product.descriptionKey?.replace(/^products\./, "") || "";

  try {
    const translated = t(relativeKey);
    if (
      translated &&
      translated !== relativeKey &&
      !translated.startsWith("products.admin") &&
      !translated.startsWith("admin.")
    ) {
      return translated;
    }
  } catch {}

  return product.description || product.descriptionKey;
}
export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "…";
}

export function getProductTagline(product: Product, t: TranslateFn, maxLength = 110): string {
  const description = getProductDescription(product, t);
  return truncate(stripHtml(description), maxLength);
}
