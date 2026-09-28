import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/adminApiHelpers";
import { adminListProducts, adminUpdateProduct, PRODUCTS_TAG } from "@/lib/productsData";
import { translateProductLocale, TARGET_LOCALES, ProductTranslations } from "@/lib/translateProduct";

export const maxDuration = 60;

const CONCURRENCY = 4; // stay under OpenRouter rate limits
const TIME_BUDGET_MS = 30_000; // stop starting new jobs after this; click again for the rest

/**
 * Fills in whatever product/language combinations are missing (or everything
 * with ?force=1), merging into existing translations. Safe to click repeatedly.
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
  const started = Date.now();

  try {
    const products = await adminListProducts();

    type Job = { productId: string; name: string; description: string; locale: string };
    const jobs: Job[] = [];
    let skipped = 0;
    for (const p of products) {
      const missing = TARGET_LOCALES.filter((l) => force || !p.translations?.[l]?.name);
      if (missing.length === 0) skipped++;
      for (const locale of missing) {
        jobs.push({ productId: p.id, name: p.name ?? "", description: p.description ?? "", locale });
      }
    }

    const done: Record<string, ProductTranslations> = {};
    const errors: string[] = [];
    let cursor = 0;
    let failed = 0;

    async function worker() {
      while (cursor < jobs.length && Date.now() - started < TIME_BUDGET_MS) {
        const job = jobs[cursor++];
        const { value, errors: errs } = await translateProductLocale(job.name, job.description, job.locale);
        if (value) {
          (done[job.productId] ??= {})[job.locale] = value;
        } else {
          failed++;
          errors.push(...errs);
        }
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));

    let translated = 0;
    for (const p of products) {
      const fresh = done[p.id];
      if (!fresh) continue;
      translated += Object.keys(fresh).length;
      await adminUpdateProduct(p.id, { translations: { ...(p.translations ?? {}), ...fresh } });
    }

    revalidateTag(PRODUCTS_TAG, "max");
    const remaining = jobs.length - translated - failed;
    return NextResponse.json({
      translated,
      failed,
      skipped,
      remaining: Math.max(0, remaining),
      errors: Array.from(new Set(errors)).slice(0, 3),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
