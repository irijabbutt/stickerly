import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/adminApiHelpers";
import { adminCreateProduct, PRODUCTS_TAG, ProductInput } from "@/lib/productsData";
import { translateProductToAllLocales } from "@/lib/translateProduct";

export const maxDuration = 60; // room for the one-off translation call

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  let body: ProductInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.slug || !body.name || !body.category || !body.image) {
    return NextResponse.json(
      { error: "slug, name, category, and image are required" },
      { status: 400 }
    );
  }

  try {
    // Translate once at save time; stored in Supabase and served to everyone.
    const translations =
      body.translations ?? (await translateProductToAllLocales(body.name, body.description || ""));
    const product = await adminCreateProduct({ ...body, translations });
    revalidateTag(PRODUCTS_TAG, "max");
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
