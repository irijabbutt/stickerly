import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { baseUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => ({
    url: `${baseUrl}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/`])
      ),
    },
  }));
}
