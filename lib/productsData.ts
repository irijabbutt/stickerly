import { SUPABASE_URL, SUPABASE_ANON_KEY, getServiceRoleKey } from "./supabaseConfig";
import { Product, ProductCategory } from "./products";

export const PRODUCTS_TAG = "products";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_usd: number;
  original_price_usd: number | null;
  category: ProductCategory;
  image: string;
  images: string[];
  tags: string[];
  is_pack: boolean;
  coming_soon: boolean;
  gumroad_product_id: string | null;
  gumroad_seller: string | null;
  rating_value: number | null;
  review_count: number | null;
  translations: Record<string, { name: string; description: string }>;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nameKey: `products.admin.${row.id}.name`,
    descriptionKey: `products.admin.${row.id}.description`,
    name: row.name,
    description: row.description,
    priceUSD: Number(row.price_usd),
    originalPriceUSD:
      row.original_price_usd != null ? Number(row.original_price_usd) : undefined,
    images: row.images?.length ? row.images : undefined,
    ratingValue: row.rating_value != null ? Number(row.rating_value) : undefined,
    reviewCount: row.review_count ?? undefined,
    gumroadProductId: row.gumroad_product_id || "",
    gumroadSeller: row.gumroad_seller || undefined,
    category: row.category,
    image: row.image,
    tags: row.tags || [],
    isPack: row.is_pack,
    isAdmin: true,
    comingSoon: row.coming_soon,
    translations:
      row.translations && Object.keys(row.translations).length > 0
        ? row.translations
        : undefined,
    updatedAt: row.updated_at,
  };
}

/** Public, cached read — used everywhere the storefront needs the catalog. */
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&order=sort_order.asc,created_at.desc`,
    {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: 300, tags: [PRODUCTS_TAG] },
    }
  );
  if (!res.ok) return [];
  const rows: ProductRow[] = await res.json();
  return rows.map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: 300, tags: [PRODUCTS_TAG, `product:${slug}`] },
    }
  );
  if (!res.ok) return null;
  const rows: ProductRow[] = await res.json();
  return rows[0] ? mapRow(rows[0]) : null;
}

// ---------------------------------------------------------------------------
// Admin (service-role) mutations — only ever called from app/api/admin/* route
// handlers, which check the signed admin session cookie first.
// ---------------------------------------------------------------------------

export interface ProductInput {
  slug: string;
  name: string;
  description?: string;
  priceUSD: number;
  originalPriceUSD?: number;
  category: ProductCategory;
  image: string;
  images?: string[];
  tags?: string[];
  isPack?: boolean;
  comingSoon?: boolean;
  gumroadProductId?: string;
  gumroadSeller?: string;
  ratingValue?: number;
  reviewCount?: number;
  translations?: Record<string, { name: string; description: string }>;
}

function authHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export async function adminCreateProduct(input: ProductInput): Promise<Product> {
  const key = getServiceRoleKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: authHeaders(key),
    body: JSON.stringify({
      slug: input.slug,
      name: input.name,
      description: input.description || "",
      price_usd: input.priceUSD,
      original_price_usd: input.originalPriceUSD ?? null,
      category: input.category,
      image: input.image,
      images: input.images || [],
      tags: input.tags || [],
      is_pack: input.isPack ?? true,
      coming_soon: input.comingSoon ?? false,
      gumroad_product_id: input.gumroadProductId || null,
      gumroad_seller: input.gumroadSeller || null,
      rating_value: input.ratingValue ?? null,
      review_count: input.reviewCount ?? null,
      translations: input.translations || {},
    }),
  });
  if (!res.ok) throw new Error(`Failed to create product: ${await res.text()}`);
  const rows: ProductRow[] = await res.json();
  return mapRow(rows[0]);
}

export async function adminUpdateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product> {
  const patch: Record<string, unknown> = {};
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.name !== undefined) patch.name = input.name;
  if (input.description !== undefined) patch.description = input.description;
  if (input.priceUSD !== undefined) patch.price_usd = input.priceUSD;
  if (input.originalPriceUSD !== undefined) patch.original_price_usd = input.originalPriceUSD;
  if (input.category !== undefined) patch.category = input.category;
  if (input.image !== undefined) patch.image = input.image;
  if (input.images !== undefined) patch.images = input.images;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.isPack !== undefined) patch.is_pack = input.isPack;
  if (input.comingSoon !== undefined) patch.coming_soon = input.comingSoon;
  if (input.gumroadProductId !== undefined) patch.gumroad_product_id = input.gumroadProductId;
  if (input.gumroadSeller !== undefined) patch.gumroad_seller = input.gumroadSeller;
  if (input.ratingValue !== undefined) patch.rating_value = input.ratingValue;
  if (input.reviewCount !== undefined) patch.review_count = input.reviewCount;
  if (input.translations !== undefined) patch.translations = input.translations;

  const key = getServiceRoleKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: authHeaders(key),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update product: ${await res.text()}`);
  const rows: ProductRow[] = await res.json();
  if (!rows[0]) throw new Error("Product not found");
  return mapRow(rows[0]);
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const key = getServiceRoleKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Failed to delete product: ${await res.text()}`);
}
