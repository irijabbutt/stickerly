import { Product } from './products';

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
  options?: { wanted?: boolean; quantity?: number },
): string | null {
  const id = getGumroadProductId(product);
  if (!isConfiguredId(id)) return null;

  const url = new URL(buildSellerProductUrl(product, id));
  if (options?.wanted) {
    url.searchParams.set('wanted', 'true');
  }
  if (options?.quantity) {
    url.searchParams.set('quantity', options.quantity.toString());
  }
  return url.toString();
}

export function buildGumroadCartUrl(
  items: { product: Product; quantity: number }[],
): string | null {
  if (items.length === 0) return 'https://gumroad.com/discover';
  if (!isGumroadCartReady(items)) return null;

  // Single product checkout: pass direct /l/ link with explicit quantity
  if (items.length === 1) {
    return buildGumroadProductUrl(items[0].product, {
      wanted: true,
      quantity: items[0].quantity,
    });
  }

  // Multi-item cart checkout
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
