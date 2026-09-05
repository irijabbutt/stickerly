import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTABanner } from "@/components/sections/CTABanner";
import { products } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

async function loadMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  const baseUrl = "https://stickerly.example.com";
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "en": `${baseUrl}/en`,
        "zh": `${baseUrl}/zh`,
        "ur": `${baseUrl}/ur`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: messages.metadata.title,
      description: messages.metadata.description,
      url: `${baseUrl}/${locale}`,
      siteName: "Stickerly",
      locale,
      type: "website",
    },
  };
}

export default function HomePage() {
  return (
    <>
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
