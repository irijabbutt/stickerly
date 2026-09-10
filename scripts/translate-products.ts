import fs from "fs";
import path from "path";
import { products, Product } from "../lib/products";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("Error: OPENROUTER_API_KEY environment variable is missing.");
  process.exit(1);
}

const LOCALES = ["ur", "ko", "ja", "zh"] as const;
type SupportedLocale = (typeof LOCALES)[number];

const MESSAGES_DIR = path.join(process.cwd(), "messages");

const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  ur: "Urdu",
  ko: "Korean",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
};

interface TranslationResult {
  title: string;
  tagline: string;
  description: string;
}

interface MessagesFile {
  products?: Record<
    string,
    {
      title: string;
      tagline: string;
      description: string;
    }
  >;
  [key: string]: unknown;
}

async function translateWithOpenRouter(
  product: Product,
  locale: SupportedLocale
): Promise<TranslationResult> {
  const prompt = `You are a professional localizer for an e-commerce website.
Translate the following product metadata into ${LANGUAGE_NAMES[locale]} (${locale}).

Rules:
- Retain exact HTML tags, attributes, and formatting inside the description.
- Keep brand names like "Stickerly" or "Gumroad" untranslated unless natural.
- Return ONLY valid JSON matching this schema:
{
  "title": "Translated product title",
  "tagline": "Translated short tagline",
  "description": "Translated detailed HTML description"
}

Product Title: ${product.name || ""}
Product Tagline: ${product.description || ""}
Product Description: ${product.description || ""}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stickerly.app",
      "X-Title": "Stickerly",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.statusText}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  let rawContent = data.choices[0].message.content.trim();

  if (rawContent.startsWith("```")) {
    rawContent = rawContent.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(rawContent) as TranslationResult;
}

async function run() {
  for (const locale of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    let fileContent: MessagesFile = {};

    if (fs.existsSync(filePath)) {
      try {
        const rawText = fs.readFileSync(filePath, "utf-8").trim();
        if (rawText) {
          fileContent = JSON.parse(rawText) as MessagesFile;
        }
      } catch {
        console.warn(`Warning: Could not parse ${locale}.json, resetting structure.`);
        fileContent = {};
      }
    }

    if (!fileContent.products) {
      fileContent.products = {};
    }

    console.log(`\nTranslating products for locale: [${locale.toUpperCase()}]...`);

    for (const product of products) {
      console.log(` -> Processing: "${product.name || product.slug}"`);
      try {
        const translated = await translateWithOpenRouter(product, locale);

        fileContent.products[product.slug] = {
          title: translated.title,
          tagline: translated.tagline,
          description: translated.description,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Failed to translate ${product.slug} to ${locale}:`, errorMessage);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
    console.log(`Saved translations to messages/${locale}.json`);
  }
}

run();
