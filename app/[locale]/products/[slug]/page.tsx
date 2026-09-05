import { Metadata } from "next";
import { ProductDetailClient } from "@/components/sections/ProductDetailClient";
import { type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Product — Stickerly",
    alternates: {
      canonical: `/${locale}/products/`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
