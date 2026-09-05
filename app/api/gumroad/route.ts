import { NextRequest, NextResponse } from "next/server";

const GUMROAD_API_BASE = "https://api.gumroad.com/v2";

interface GumroadApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  thumbnail_url?: string;
  preview_url?: string;
  tags?: string[];
  short_url?: string;
  permalink?: string;
  custom_permalink?: string;
}

async function fetchProductFromApi(
  productPermalink: string
): Promise<GumroadApiProduct | null> {
  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
  if (!accessToken) return null;

  const headers = { Authorization: `Bearer ${accessToken}` };

  // Try direct lookup by permalink first.
  const direct = await fetch(
    `${GUMROAD_API_BASE}/products/${encodeURIComponent(productPermalink)}`,
    { headers }
  );
  if (direct.ok) {
    const data = await direct.json();
    if (data.success && data.product) return data.product as GumroadApiProduct;
  }

  // Fall back to listing all products and matching the URL slug.
  const list = await fetch(`${GUMROAD_API_BASE}/products`, { headers });
  if (!list.ok) return null;

  const data = await list.json();
  if (!data.success || !Array.isArray(data.products)) return null;

  const match = (data.products as GumroadApiProduct[]).find((product) => {
    const slug = productPermalink.toLowerCase();
    const urls = [
      product.permalink,
      product.custom_permalink,
      product.short_url,
    ];
    return urls.some(
      (url) => url && url.toLowerCase().endsWith(slug)
    );
  });

  return match || null;
}

function parseMeta(html: string, property: string): string | undefined {
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]*)"`,
    "i"
  );
  const match = html.match(regex);
  return match ? decodeHtmlEntities(match[1]) : undefined;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function deriveTags(title: string, description: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "dare", "ought", "used", "this", "that", "these", "those", "i", "you",
    "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
    "my", "your", "his", "its", "our", "their", "what", "which", "who",
    "whom", "whose", "where", "when", "why", "how", "all", "each", "every",
    "both", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "|", "&", "-", "—", "–", " stickers ", " sticker ", " bundle ", " pack ",
  ]);

  const text = `${title} ${description}`.toLowerCase();
  const words = text.match(/[a-z0-9]+/g) || [];
  const counts = new Map<string, number>();

  for (const word of words) {
    if (word.length < 3 || stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    if (!hostname.endsWith("gumroad.com")) {
      return NextResponse.json(
        { error: "Only Gumroad URLs are supported" },
        { status: 400 }
      );
    }

    const pathMatch = parsedUrl.pathname.match(/\/l\/([^/]+)/);
    if (!pathMatch) {
      return NextResponse.json({ error: "Invalid Gumroad URL" }, { status: 400 });
    }
    const productPermalink = pathMatch[1];

    // Prefer authenticated Gumroad API when an access token is configured.
    const apiProduct = await fetchProductFromApi(productPermalink);
    if (apiProduct) {
      const tags = apiProduct.tags?.length
        ? apiProduct.tags
        : deriveTags(apiProduct.name, apiProduct.description);

      return NextResponse.json({
        title: apiProduct.name,
        description: apiProduct.description,
        priceUSD: apiProduct.price / 100,
        currency: apiProduct.currency || "USD",
        image: apiProduct.thumbnail_url || apiProduct.preview_url || "",
        tags,
      });
    }

    // Fall back to public-page metadata scraping.
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gumroad returned ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();

    const title =
      parseMeta(html, "og:title") ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ||
      "";

    const description =
      parseMeta(html, "description") || parseMeta(html, "og:description") || "";

    const priceAmount = parseMeta(html, "product:price:amount");
    const priceCurrency = parseMeta(html, "product:price:currency") || "USD";
    const priceUSD = priceAmount ? parseFloat(priceAmount) : 0;

    const image = parseMeta(html, "og:image") || "";

    const tags = deriveTags(title, description);

    return NextResponse.json({
      title,
      description,
      priceUSD,
      currency: priceCurrency,
      image,
      tags,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
