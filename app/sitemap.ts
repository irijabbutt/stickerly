import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products } from "@/lib/products";
import { baseUrl } from "@/lib/site";

export const dynamic = "force-static";

const categories = ["stickers", "animated-ui", "3d-scenes"] as const;

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

  const categoryEntries = categories.flatMap((category) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/category/${category}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/category/${category}/`])
        ),
      },
    }))
  );

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

  const checkoutEntries = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/checkout/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/checkout/`])
      ),
    },
  }));

  return [
    ...homeEntries,
    ...categoryEntries,
    ...productEntries,
    ...checkoutEntries,
  ];
}
