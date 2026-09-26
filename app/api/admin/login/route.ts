import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSessionToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from "@/lib/adminSession";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      {
        error:
          "Admin login isn't configured. Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables in Vercel.",
      },
      { status: 500 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  const emailMatches = safeCompare(email, adminEmail.trim().toLowerCase());
  const passwordMatches = password.length > 0 && safeCompare(password, adminPassword);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  let token: string;
  try {
    token = createSessionToken();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Session error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}
