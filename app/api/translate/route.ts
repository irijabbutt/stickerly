import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  try {
    const { name, description, locale } = await req.json();

    if (!locale || locale === "en" || !OPENROUTER_API_KEY) {
      return NextResponse.json({ name, description });
    }

    const prompt = `You are a professional localizer. Translate the following product metadata into target language code "${locale}".
Return ONLY a valid JSON object:
{
  "name": "Translated product title",
  "description": "Translated detailed HTML description (preserve exact HTML tags and formatting)"
}

Title: ${name || ""}
Description: ${description || ""}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ name, description });
    }

    const data = await res.json();
    let content = data.choices?.[0]?.message?.content?.trim() || "";
    if (content.startsWith("```")) {
      content = content.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(content);
    return NextResponse.json({
      name: parsed.name || name,
      description: parsed.description || description,
    });
  } catch (err) {
    return NextResponse.json({ name, description });
  }
}
