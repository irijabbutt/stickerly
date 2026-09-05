export type ProductCategory = 'stickers' | 'animated' | '3d';

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  name?: string;
  description?: string;
  priceUSD: number;
  gumroadProductId: string;
  gumroadSeller?: string;
  category: ProductCategory;
  image: string;
  tags: string[];
  isPack: boolean;
  isAdmin?: boolean;
}

export const products: Product[] = [];

export type TranslateFn = (key: string) => string;

export function getProductName(product: Product, t: TranslateFn): string {
  return product.name || t(product.nameKey);
}

export function getProductDescription(product: Product, t: TranslateFn): string {
  return product.description || t(product.descriptionKey);
}
