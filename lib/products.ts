export type ProductCategory = 'stickers' | 'animated' | '3d';

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  name?: string;
  description?: string;
  priceUSD: number;
  originalPriceUSD?: number;
  images?: string[];
  ratingValue?: number;
  reviewCount?: number;
  gumroadProductId: string;
  gumroadSeller?: string;
  category: ProductCategory;
  image: string;
  tags: string[];
  isPack: boolean;
  isAdmin?: boolean;
  comingSoon?: boolean;
  translations?: Record<string, { name: string; description: string }>;
}

// Single definition containing your product objects:
export const products: Product[] = [
  // ... your product entries here
{
    id: "stickers1",
    slug: "stickers1",
    nameKey: "products.admin.stickers1.name",
    descriptionKey: "products.admin.stickers1.description",
    name: "Kawaii Anime Creature Stickers – 20 Cute Animal PNG Stickers | Printable & Digital Sticker Bundle",
    description: "<h3>🧸 Kawaii Anime Creature Sticker Bundle – 20 Cute PNG Stickers</h3><p>Meet your new collection of adorable creature friends! 💕✨</p><p>This 20-piece kawaii anime-inspired sticker bundle features a colorful collection of cute animals, fantasy creatures, and magical characters designed to add instant personality to your planners, journals, scrapbooks, and creative projects.</p>",
    priceUSD: 2.99,
    originalPriceUSD: 4.99,
    gumroadProductId: "stickers1",
    category: "stickers",
    image: "/products/kawaii-creatures.png",
    tags: ["kawaii stickers", "cute stickers", "digital stickers", "sticker png", "anime stickers"],
    isPack: true,
    translations: {
      zh: {
        name: "Kawaii 动漫生物贴纸 – 20 张可爱动物 PNG 贴纸 | 可打印与数字贴纸包",
        description: "<h3>🧸 Kawaii 动漫生物贴纸包 – 20 张可爱 PNG 贴纸</h3><p>快来认识你的新可爱生物朋友系列吧！💕✨</p><p>这款 20 件套 Kawaii 动漫风格贴纸包包含色彩丰富的可爱动物、幻想生物和神奇角色，旨在为您的手帐、日记、剪贴簿和创意项目增添独特个性。</p><h3>✨ 包含内容</h3><ul><li>🐾 20 张独立高分辨率 PNG 贴纸</li><li>📄 A4 可打印贴纸页</li><li>📄 美制信纸可打印贴纸页</li><li>📱 数字手帐 / GoodNotes 适用贴纸页</li></ul>",
      },
      ja: {
        name: "Kawaii アニメクリーチャーステッカー – 20枚の可愛い動物PNGステッカー | 印刷可能＆デジタルステッカーセット",
        description: "<h3>🧸 Kawaii アニメクリーチャーステッカーパック – 20枚の可愛いPNGステッカー</h3><p>愛らしい生き物の仲間たちの新しいコレクションに会いましょう！💕✨</p><p>この20点のKawaiiアニメ風ステッカーパックには、手帳や日記、スクラップブック、クリエイティブなプロジェクトに個性を加える可愛い動物やファンタジー生物が詰まっています。</p>",
      },
      ur: {
        name: "کیوائی اینیمی کریچر اسٹیکرز – 20 پیارے جانوروں کے PNG اسٹیکرز | پرنٹ ایبل اور ڈیجیٹل بنڈل",
        description: "<h3>🧸 کیوائی اینیمی کریچر اسٹیکر بنڈل – 20 پیارے PNG اسٹیکرز</h3><p>اپنے پیارے دوستوں کے نئے کلیکشن سے ملیں! 💕✨</p><p>یہ 20 ٹکڑوں پر مشتمل اینیمی سے متاثر اسٹیکر بنڈل آپ کے پلانرز اور ڈائریاں سجانے کے لیے بہترین ہے۔</p>",
      },
      ko: {
        name: "카와이 애니메이션 크리처 스티커 – 20개 귀여운 동물 PNG 스티커 | 인쇄용 및 디지털 스티커 번들",
        description: "<h3>🧸 카와이 애니메이션 크리처 스티커 번들 – 20개 귀여운 PNG 스티커</h3><p>사랑스러운 크리처 친구들의 새로운 컬렉션을 만나보세요! 💕✨</p>",
      },
    },
  },  
];

export type TranslateFn = (key: string) => string;

export function getProductName(product: Product, t: TranslateFn, locale?: string): string {
  if (!product) return "";

  // Check auto-generated translations stored in product object
  if (locale && product.translations?.[locale]?.name) {
    return product.translations[locale].name;
  }

  const relativeKey = product.nameKey?.replace(/^products\./, "") || "";

  try {
    const translated = t(relativeKey);
    if (
      translated &&
      translated !== relativeKey &&
      !translated.startsWith("products.admin") &&
      !translated.startsWith("admin.")
    ) {
      return translated;
    }
  } catch {}

  return product.name || product.nameKey;
}

export function getProductDescription(product: Product, t: TranslateFn, locale?: string): string {
  if (!product) return "";

  // Check auto-generated translations stored in product object
  if (locale && product.translations?.[locale]?.description) {
    return product.translations[locale].description;
  }

  const relativeKey = product.descriptionKey?.replace(/^products\./, "") || "";

  try {
    const translated = t(relativeKey);
    if (
      translated &&
      translated !== relativeKey &&
      !translated.startsWith("products.admin") &&
      !translated.startsWith("admin.")
    ) {
      return translated;
    }
  } catch {}

  return product.description || product.descriptionKey;
}
export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "…";
}

export function getProductTagline(product: Product, t: TranslateFn, maxLength = 110): string {
  const description = getProductDescription(product, t);
  return truncate(stripHtml(description), maxLength);
}
