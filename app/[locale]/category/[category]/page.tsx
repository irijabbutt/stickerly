import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductCategory } from "@/lib/products";
import { baseUrl } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n";
import { CategoryGrid } from "@/components/sections/CategoryGrid";

const categorySlugs: Record<string, ProductCategory> = {
  stickers: "stickers",
  "animated-ui": "animated",
  "3d-scenes": "3d",
};

const slugToKey: Record<string, "stickers" | "animated" | "3d"> = {
  stickers: "stickers",
  "animated-ui": "animated",
  "3d-scenes": "3d",
};

async function loadMessages(locale: Locale) {
  return (await import(`../../../../messages/${locale}.json`)).default;
}

export async function generateStaticParams() {
  return Object.keys(categorySlugs).flatMap((category) =>
    locales.map((locale) => ({ locale, category }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const key = slugToKey[category];
  if (!key) return {};

  const messages = await loadMessages(locale);
  const data = messages.categories[key];
  const categoryUrl = `${baseUrl}/${locale}/category/${category}/`;

  return {
    metadataBase: new URL(baseUrl),
    title: data.title,
    description: data.description,
    alternates: {
      canonical: categoryUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [
            l,
            `${baseUrl}/${l}/category/${category}/`,
          ])
        ),
        "x-default": `${baseUrl}/en/category/${category}/`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: categoryUrl,
      siteName: "Stickerly",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category } = await params;
  const key = slugToKey[category];
  if (!key) notFound();

  const messages = await loadMessages(locale);
  const data = messages.categories[key];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.title,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CategoryGrid categoryKey={key} />
    </>
  );
}
