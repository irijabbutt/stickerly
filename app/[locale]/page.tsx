import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTABanner } from "@/components/sections/CTABanner";
import { products } from "@/lib/products";
import { baseUrl } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n";

async function loadMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

function resolveMessage(obj: Record<string, unknown>, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/`])
        ),
        "x-default": `${baseUrl}/en/`,
      },
    },
    openGraph: {
      title: messages.metadata.title,
      description: messages.metadata.description,
      url: `${baseUrl}/${locale}/`,
      siteName: "Stickerly",
      locale,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  const tProducts = messages.products;

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stickerly",
    url: `${baseUrl}/`,
    logo: `${baseUrl}/logo.svg`,
    sameAs: ["https://gumroad.com/stickerly"],
  };

  const productListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: resolveMessage(tProducts, product.nameKey) || product.nameKey,
        description:
          resolveMessage(tProducts, product.descriptionKey) ||
          product.descriptionKey,
        image: `${baseUrl}${product.image}`,
        offers: {
          "@type": "Offer",
          price: product.priceUSD.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `https://gumroad.com/l/${product.gumroadProductId}`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationLd, productListLd]),
        }}
      />
      <Hero />
      <ProductGrid products={products} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}
