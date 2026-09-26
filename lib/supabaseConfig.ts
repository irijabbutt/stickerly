// Public project URL + anon key — safe to expose, protected by Row Level Security
// (read-only for everyone; writes are only possible with the service role key below).
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ewsbfaxvwyzxmhfhortz.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3c2JmYXh2d3l6eG1oZmhvcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjI5MjcsImV4cCI6MjEwNDE5ODkyN30.fkkJ8EIrQ0SjAsn76gvsMbEifGtEoT-fAXUANXh4oRc";

/**
 * The service role key bypasses Row Level Security and must NEVER reach the
 * browser. It's only read inside app/api/admin/* route handlers (server-only).
 * Set it in Vercel → Project Settings → Environment Variables, copying the
 * value from Supabase → Project Settings → API → service_role secret.
 */
export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel's Environment Variables " +
        "(copy the service_role secret from the Supabase dashboard → Project Settings → API)."
    );
  }
  return key;
}
