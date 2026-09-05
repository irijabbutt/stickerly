import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "zh", "ur", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  let resolvedLocale = locale;
  if (!resolvedLocale) {
    resolvedLocale = (await requestLocale) as Locale | undefined;
  }
  if (!resolvedLocale || !locales.includes(resolvedLocale as Locale)) {
    resolvedLocale = defaultLocale;
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    timeZone: "UTC",
  };
});
