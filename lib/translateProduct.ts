import { locales } from "./i18n";

export type ProductTranslations = Record<string, { name: string; description: string }>;

export interface TranslateOutcome {
  translations: ProductTranslations;
  errors: string[];
}

const LANG_NAMES: Record<string, string> = {
  zh: "Simplified Chinese",
  ur: "Urdu",
  ja: "Japanese",
  ko: "Korean",
};

// Tried in order until one works. Set OPENROUTER_MODEL in Vercel to force a
// specific model first (any slug from openrouter.ai/models).
function candidateModels(): string[] {
  const list = [
    process.env.OPENROUTER_MODEL,
    "google/gemini-2.5-flash",
    "openai/gpt-4o-mini",
    "anthropic/claude-haiku-4.5",
  ].filter((m): m is string => Boolean(m && m.trim()));
  return Array.from(new Set(list));
}

async function callModel(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.error) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`${model}: ${msg}`);
  }
  const content: string = data.choices?.[0]?.message?.content?.trim() || "";
  if (!content) throw new Error(`${model}: empty response`);
  return content;
}

// Plain delimiters instead of JSON: HTML descriptions are full of quotes and
// newlines, which models frequently fail to escape correctly inside JSON.
function parseReply(content: string): { name: string; description: string } | null {
  const cleaned = content.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");
  const m = cleaned.match(/===NAME===\s*([\s\S]*?)\s*===DESCRIPTION===\s*([\s\S]*)$/);
  if (!m || !m[1].trim()) return null;
  return { name: m[1].trim(), description: m[2].trim() };
}

async function translateOne(
  apiKey: string,
  locale: string,
  name: string,
  description: string,
  errors: string[]
): Promise<{ name: string; description: string } | null> {
  const language = LANG_NAMES[locale] ?? locale;
  const prompt = `You are a professional product localizer. Translate the product title and description below into ${language}.
Rules:
- Keep every HTML tag, attribute, link and emoji in the description exactly as they are; translate only the readable text.
- Keep brand and library names (Stickerly, React, Framer Motion, PNG, etc.) unchanged.
- Reply in EXACTLY this format and nothing else:
===NAME===
<translated title>
===DESCRIPTION===
<translated description>

TITLE:
${name}

DESCRIPTION:
${description}`;

  for (const model of candidateModels()) {
    try {
      const parsed = parseReply(await callModel(apiKey, model, prompt));
      if (parsed) return parsed;
      errors.push(`${model}: unexpected reply format`);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  return null;
}

/** Translates into every non-English locale; reports why anything failed. */
export async function translateProductDetailed(
  name: string,
  description: string
): Promise<TranslateOutcome> {
  const errors: string[] = [];
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { translations: {}, errors: ["OPENROUTER_API_KEY is not set"] };
  if (!name && !description) return { translations: {}, errors };

  const targets = locales.filter((l) => l !== "en");
  const results = await Promise.all(
    targets.map((l) => translateOne(apiKey, l, name, description, errors))
  );

  const translations: ProductTranslations = {};
  targets.forEach((l, i) => {
    const r = results[i];
    if (r) translations[l] = r;
  });
  return { translations, errors };
}

/** Never throws; returns {} on failure so products still save untranslated. */
export async function translateProductToAllLocales(
  name: string,
  description: string
): Promise<ProductTranslations> {
  return (await translateProductDetailed(name, description)).translations;
}
