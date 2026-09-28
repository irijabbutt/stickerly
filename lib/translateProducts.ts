import { locales } from "./i18n";

export type ProductTranslations = Record<string, { name: string; description: string }>;

const LANG_NAMES: Record<string, string> = {
  zh: "Simplified Chinese",
  ur: "Urdu",
  ja: "Japanese",
  ko: "Korean",
};

/**
 * Translates a product's name + description into every non-English locale in
 * ONE model call, so the result can be stored in the products.translations
 * column and served instantly to every visitor (no per-visitor API calls).
 * Never throws: on any failure it returns {} and the product simply falls back
 * to its original text.
 */
export async function translateProductToAllLocales(
  name: string,
  description: string
): Promise<ProductTranslations> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || (!name && !description)) return {};

  const targets = locales.filter((l) => l !== "en");
  const list = targets.map((l) => `"${l}" = ${LANG_NAMES[l] ?? l}`).join(", ");

  const prompt = `You are a professional product localizer. Translate this product's title and description into these languages: ${list}.
Keep the description's HTML tags, attributes, links and structure exactly as-is; translate only the human-readable text. Keep brand names (e.g. Stickerly) untranslated.
Return ONLY a valid JSON object shaped like:
{ ${targets.map((l) => `"${l}": { "name": "...", "description": "..." }`).join(", ")} }

Title: ${name}
Description: ${description}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return {};

    const data = await res.json();
    let content: string = data.choices?.[0]?.message?.content?.trim() || "";
    if (content.startsWith("```")) {
      content = content.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(content);

    const out: ProductTranslations = {};
    for (const l of targets) {
      const entry = parsed?.[l];
      if (entry && typeof entry.name === "string" && entry.name.trim()) {
        out[l] = {
          name: entry.name,
          description: typeof entry.description === "string" ? entry.description : description,
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}
