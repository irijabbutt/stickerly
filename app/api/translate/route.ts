import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let name = "";
  let description = "";

  try {
    const body = await req.json();
    name = body.name || "";
    description = body.description || "";
    const locale = body.locale;

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!locale || locale === "en" || !apiKey) {
      if (!apiKey) {
        console.warn("OPENROUTER_API_KEY is missing in environment variables.");
      }
      return NextResponse.json({ name, description });
    }

    const prompt = `You are a professional localizer. Translate the following product metadata into target language code "${locale}".
Return ONLY a valid JSON object:
{
  "name": "Translated product title",
  "description": "Translated detailed HTML description (preserve exact HTML tags and formatting)"
}

Title: ${name}
Description: ${description}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
