import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApiHelpers";
import { SUPABASE_URL, getServiceRoleKey } from "@/lib/supabaseConfig";

export const runtime = "nodejs";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 400 });
  }

  let key: string;
  try {
    key = getServiceRoleKey();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Storage not configured";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-upsert": "false",
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    return NextResponse.json({ error: `Upload failed: ${await uploadRes.text()}` }, { status: 500 });
  }

  return NextResponse.json({ url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}` });
}
