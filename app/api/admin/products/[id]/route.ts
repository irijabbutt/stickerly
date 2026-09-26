import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/adminApiHelpers";
import {
  adminUpdateProduct,
  adminDeleteProduct,
  PRODUCTS_TAG,
  ProductInput,
} from "@/lib/productsData";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { id } = await params;

  let body: Partial<ProductInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const product = await adminUpdateProduct(id, body);
    revalidateTag(PRODUCTS_TAG, "max");
    return NextResponse.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { id } = await params;

  try {
    await adminDeleteProduct(id);
    revalidateTag(PRODUCTS_TAG, "max");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
