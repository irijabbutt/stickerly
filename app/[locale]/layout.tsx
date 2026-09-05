import { NextIntlClientProvider, Locale, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { locales } from "@/lib/i18n";
import { baseUrl } from "@/lib/site";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InteractiveBackground } from "@/components/effects/InteractiveBackground";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
  const title = messages.metadata.title;
  const description = messages.metadata.description;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: `/${locale}/`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/`,
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
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await loadMessages(locale);
  const isRtl = locale === "ur";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full flex flex-col text-foreground">
        <InteractiveBackground />
        <div className="relative z-10 flex min-h-full flex-1 flex-col bg-background/80 backdrop-blur-sm">
          <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
