import { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { baseUrl } from "@/lib/site";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

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
  const title = messages.checkout.title;
  const description = messages.checkout.description;
  const checkoutUrl = `${baseUrl}/${locale}/checkout/`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: checkoutUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/checkout/`])
        ),
        "x-default": `${baseUrl}/en/checkout/`,
      },
    },
    openGraph: {
      title,
      description,
      url: checkoutUrl,
      siteName: "Stickerly",
      locale,
      type: "website",
      images: [{ url: "/logo.svg", alt: "Stickerly" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.svg"],
    },
  };
}

// Next.js requires 'export default' on page routes
export default function CheckoutPage() {
  return <CheckoutSummary />;
}
