import { NextIntlClientProvider, Locale, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { locales } from "@/lib/i18n";
import { baseUrl } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimeBackground } from "@/components/effects/AnimeBackground";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SaleCountdownWrapper } from "@/components/sections/SaleCountdownWrapper";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
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

const themeInitScript = `
(function() {
  try {
    const theme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && systemDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    other: {
      "google-adsense-account": "ca-pub-3928614399514099",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative isolate min-h-full flex flex-col text-foreground">
        <ThemeProvider>
          <AnimeBackground />
          <div className="relative z-10 flex min-h-full flex-1 flex-col bg-background/70 dark:bg-background/50">
            <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
              <Header />
              <SaleCountdownWrapper />
              <main className="flex-1">{children}</main>
              <Footer />
              <Analytics />
              <SpeedInsights />
            </NextIntlClientProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
