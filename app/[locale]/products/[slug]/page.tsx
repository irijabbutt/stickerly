import { Metadata } from "next";
import { ProductDetailClient } from "@/components/sections/ProductDetailClient";
import { getProductBySlug, getAllProducts } from "@/lib/productsData";
import { getProductName, getProductDescription } from "@/lib/products";
import { baseUrl } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n";

async function loadMessages(locale: Locale) {
  return (await import(`../../../../messages/${locale}.json`)).default;
}

function translatorFor(messages: Record<string, unknown>) {
  const products = messages.products as Record<string, unknown>;
  return (key: string): string => {
    const value = key
      .split(".")
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === "object" && part in (acc as Record<string, unknown>)
            ? (acc as Record<string, unknown>)[part]
            : undefined,
        products
      );
    return typeof value === "string" ? value : key;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  const url = `${baseUrl}/${locale}/products/${slug}/`;

  if (!product) {
    return { title: "Product not found — Stickerly", alternates: { canonical: url } };
  }

  const messages = await loadMessages(locale);
  const t = translatorFor(messages);
  const name = getProductName(product, t, locale);
  const description = getProductDescription(product, t, locale);
  const image = product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`;

  return {
    title: `${name} — Stickerly`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/products/${slug}/`])),
        "x-default": `${baseUrl}/en/products/${slug}/`,
      },
    },
    openGraph: {
      title: `${name} — Stickerly`,
      description,
      url,
      siteName: "Stickerly",
      images: [{ url: image }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Stickerly`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [product, allProducts, messages] = await Promise.all([
    getProductBySlug(slug),
    getAllProducts(),
    loadMessages(locale),
  ]);

  const related = product
    ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];

  if (!product) {
    return <ProductDetailClient product={null} related={[]} />;
  }

  const t = translatorFor(messages);
  const name = getProductName(product, t, locale);
  const description = getProductDescription(product, t, locale);
  const image = product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`;
  const url = `${baseUrl}/${locale}/products/${slug}/`;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    offers: {
      "@type": "Offer",
      price: product.priceUSD.toFixed(2),
      priceCurrency: "USD",
      url,
      availability: product.comingSoon
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
    },
    ...(product.ratingValue && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/${locale}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Products",
        item: `${baseUrl}/${locale}/products/`,
      },
      { "@type": "ListItem", position: 3, name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productLd, breadcrumbLd]) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
