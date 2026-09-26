import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    // Product images now live in Supabase Storage (public bucket), so Next can
    // fetch, resize, and re-encode them to AVIF/WebP on the fly.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Static files in /public — allow long caching but let a build change
        // (new deploy) be picked up within a day instead of being stuck forever.
        source: "/:path*.(svg|png|jpg|jpeg|webp|avif|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        // Product data should refresh quickly after an admin edit rather than
        // getting stuck behind a stale browser/CDN cache.
        source: "/api/products/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
