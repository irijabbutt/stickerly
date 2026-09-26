import { Metadata } from "next";
import { AllProductsGrid } from "@/components/sections/AllProductsGrid";
import { getAllProducts } from "@/lib/productsData";
import { getProductName, getProductDescription } from "@/lib/products";
import { baseUrl } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n";

async function loadMessages(locale: Locale) {
  return (await import(`../../../messages/${locale}.json`)).default;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  const meta = messages.products.allProducts;
  const url = `${baseUrl}/${locale}/products/`;

  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/products/`])),
        "x-default": `${baseUrl}/en/products/`,
      },
    },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url,
      siteName: "Stickerly",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.metaTitle,
      description: meta.metaDescription,
    },
  };
}

export default async function AllProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const products = await getAllProducts();
  const messages = await loadMessages(locale);
  const tProducts = messages.products;

  function resolveMessage(key: string): string | undefined {
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, tProducts);
    return typeof value === "string" ? value : undefined;
  }

  const translateFn = (key: string) => resolveMessage(key) ?? key;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/${locale}/` },
      { "@type": "ListItem", position: 2, name: tProducts.allProducts.title },
    ],
  };

  const productListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: getProductName(product, translateFn, locale),
        description: getProductDescription(product, translateFn, locale),
        image: product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`,
        offers: {
          "@type": "Offer",
          price: product.priceUSD.toFixed(2),
          priceCurrency: "USD",
          availability: product.comingSoon
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
          url: `${baseUrl}/${locale}/products/${product.slug}/`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, productListLd]) }}
      />
      <AllProductsGrid products={products} />
    </>
  );
}
