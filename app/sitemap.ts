import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getAllProducts } from "@/lib/productsData";
import { baseUrl } from "@/lib/site";

export const revalidate = 300;

const categories = ["stickers", "animated-ui", "3d-scenes"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

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

  const allProductsEntries = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/products/`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/products/`])
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
      lastModified: new Date(product.updatedAt || Date.now()),
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
    ...allProductsEntries,
    ...categoryEntries,
    ...productEntries,
    ...checkoutEntries,
  ];
}

