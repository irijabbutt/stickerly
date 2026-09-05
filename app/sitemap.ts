import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products } from "@/lib/products";
import { baseUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries = locales.flatMap((locale) => ({
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

  const productEntries = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/products/${product.slug}/`])
        ),
      },
    }))
  );

  return [...homeEntries, ...productEntries];
}
