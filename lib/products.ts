export type ProductCategory = "stickers" | "animated" | "3d";

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  priceUSD: number;
  gumroadProductId: string;
  category: ProductCategory;
  image: string;
  tags: string[];
  isPack: boolean;
}

export const products: Product[] = [
  {
    id: "cute-sticker-pack",
    slug: "cute-sticker-pack",
    nameKey: "cuteStickerPack.name",
    descriptionKey: "cuteStickerPack.description",
    priceUSD: 12,
    gumroadProductId: "cute-sticker-pack",
    category: "stickers",
    image: "/products/cute-sticker-pack.svg",
    tags: ["stickers", "png", "svg"],
    isPack: true,
  },
  {
    id: "motion-ui-kit",
    slug: "motion-ui-kit",
    nameKey: "motionUiKit.name",
    descriptionKey: "motionUiKit.description",
    priceUSD: 29,
    gumroadProductId: "motion-ui-kit",
    category: "animated",
    image: "/products/motion-ui-kit.svg",
    tags: ["react", "framer-motion", "ui"],
    isPack: true,
  },
  {
    id: "3d-icon-scene",
    slug: "3d-icon-scene",
    nameKey: "threeDIconScene.name",
    descriptionKey: "threeDIconScene.description",
    priceUSD: 19,
    gumroadProductId: "3d-icon-scene",
    category: "3d",
    image: "/products/3d-icon-scene.svg",
    tags: ["three.js", "glb", "3d"],
    isPack: false,
  },
  {
    id: "kawaii-animals",
    slug: "kawaii-animals",
    nameKey: "kawaiiAnimals.name",
    descriptionKey: "kawaiiAnimals.description",
    priceUSD: 9,
    gumroadProductId: "kawaii-animals",
    category: "stickers",
    image: "/products/kawaii-animals.svg",
    tags: ["stickers", "kawaii", "animals"],
    isPack: true,
  },
  {
    id: "loader-collection",
    slug: "loader-collection",
    nameKey: "loaderCollection.name",
    descriptionKey: "loaderCollection.description",
    priceUSD: 15,
    gumroadProductId: "loader-collection",
    category: "animated",
    image: "/products/loader-collection.svg",
    tags: ["loaders", "animated", "svg"],
    isPack: true,
  },
  {
    id: "floating-shapes",
    slug: "floating-shapes",
    nameKey: "floatingShapes.name",
    descriptionKey: "floatingShapes.description",
    priceUSD: 22,
    gumroadProductId: "floating-shapes",
    category: "3d",
    image: "/products/floating-shapes.svg",
    tags: ["three.js", "abstract", "3d"],
    isPack: true,
  },
];
