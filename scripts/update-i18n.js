const fs = require('fs');

const i18n = `import { getRequestConfig } from "next-intl/server";

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
    messages: (await import(\`../messages/\${resolvedLocale}.json\`)).default,
    timeZone: "UTC",
  };
});
`;

fs.writeFileSync('lib/i18n.ts', i18n);

const localeSwitcher = fs.readFileSync('components/layout/LocaleSwitcher.tsx', 'utf8');
const updated = localeSwitcher.replace(
  `const labels: Record<Locale, string> = {`,
  `const labels: Record<Locale, string> = {\n  ko: "한국어",`
);
fs.writeFileSync('components/layout/LocaleSwitcher.tsx', updated);

console.log('Updated lib/i18n.ts and LocaleSwitcher.tsx');
