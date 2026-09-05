import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products } from "@/lib/products";
import { baseUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { ProductDetail } from "@/components/sections/ProductDetail";

async function loadMessages(locale: Locale) {
  return (await import(`../../../../messages/${locale}.json`)).default;
}

export async function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: "en", slug: product.slug },
    { locale: "zh", slug: product.slug },
    { locale: "ur", slug: product.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  const messages = await loadMessages(locale);
  const tProducts = messages.products;
  const name = resolveNested(tProducts, product.nameKey) || product.nameKey;
  const description =
    resolveNested(tProducts, product.descriptionKey) || product.descriptionKey;

  return {
    title: `${name} — Stickerly`,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/products/${slug}/`,
      languages: {
        en: `${baseUrl}/en/products/${slug}/`,
        zh: `${baseUrl}/zh/products/${slug}/`,
        ur: `${baseUrl}/ur/products/${slug}/`,
        "x-default": `${baseUrl}/en/products/${slug}/`,
      },
    },
    openGraph: {
      title: `${name} — Stickerly`,
      description,
      url: `${baseUrl}/${locale}/products/${slug}/`,
      siteName: "Stickerly",
      locale,
      type: "website",
    },
  };
}

function resolveNested(obj: Record<string, unknown>, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : undefined;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const messages = await loadMessages(locale);
  const tProducts = messages.products;
  const name = resolveNested(tProducts, product.nameKey) || product.nameKey;
  const description =
    resolveNested(tProducts, product.descriptionKey) || product.descriptionKey;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${baseUrl}${product.image}`,
    offers: {
      "@type": "Offer",
      price: product.priceUSD.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://gumroad.com/l/${product.gumroadProductId}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <ProductDetail product={product} locale={locale} related={related} />
    </>
  );
}
