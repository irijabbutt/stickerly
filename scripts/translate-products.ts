import fs from "fs";
import path from "path";
import { products } from "../lib/products.js"; // Adjust path if importing directly from JSON or file

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("Error: OPENROUTER_API_KEY environment variable is missing.");
  process.exit(1);
}

const LOCALES = ["ur", "ko", "ja", "zh"];
const MESSAGES_DIR = path.join(process.cwd(), "messages");

const LANGUAGE_NAMES = {
  ur: "Urdu",
  ko: "Korean",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
};

async function translateWithOpenRouter(product, locale) {
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

Product Title: ${product.name}
Product Tagline: ${product.tagline || ""}
Product Description: ${product.description || ""}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stickerly.app",
      "X-Title": "Stickerly",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001", // Fast and cost-effective translation model
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.statusText}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

async function run() {
  for (const locale of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    let fileContent = {};

    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    fileContent.products = fileContent.products || {};

    console.log(`\nTranslating products for locale: [${locale.toUpperCase()}]...`);

    for (const product of products) {
      console.log(` -> Processing: "${product.name}"`);
      try {
        const translated = await translateWithOpenRouter(product, locale);
        
        fileContent.products[product.slug] = {
          title: translated.title,
          tagline: translated.tagline,
          description: translated.description,
        };
      } catch (err) {
        console.error(`Failed to translate ${product.slug} to ${locale}:`, err.message);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
    console.log(`Saved translations to messages/${locale}.json`);
  }
}

run();
