import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/adminApiHelpers";
import { adminListProducts, adminUpdateProduct, PRODUCTS_TAG } from "@/lib/productsData";
import { translateProductDetailed } from "@/lib/translateProduct";

export const maxDuration = 60;

/**
 * One-off backfill: translates every product that has no stored translations
 * (or all products with ?force=1) and saves the result to Supabase.
 */
export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not set in Vercel's environment variables, so translation can't run." },
      { status: 500 }
    );
  }

  const force = request.nextUrl.searchParams.get("force") === "1";

  try {
    const products = await adminListProducts();
    const todo = products.filter((p) => force || !p.translations || Object.keys(p.translations).length === 0);

    const errors: string[] = [];
    const results = await Promise.all(
      todo.map(async (p) => {
        const outcome = await translateProductDetailed(p.name ?? "", p.description ?? "");
        errors.push(...outcome.errors);
        if (Object.keys(outcome.translations).length === 0) return false;
        await adminUpdateProduct(p.id, { translations: outcome.translations });
        return true;
      })
    );

    revalidateTag(PRODUCTS_TAG, "max");
    const translated = results.filter(Boolean).length;
    return NextResponse.json({
      translated,
      failed: results.length - translated,
      skipped: products.length - todo.length,
      errors: Array.from(new Set(errors)).slice(0, 3),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
