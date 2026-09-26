// Read-only client for the shared Unify Supabase project (web + mobile app DB).
//
// `public.events` has a public-read RLS policy ("Enable read access for all
// users"), so the publishable key is enough. That key is designed to ship in
// client bundles (the mobile app carries it too) — it is not a secret. Writes
// never happen from this site.
//
// Plain PostgREST over fetch instead of @supabase/supabase-js: this site only
// ever runs two SELECTs, and fetch keeps the Worker bundle small.

const SUPABASE_URL = "https://wrbauxutkysljmsqojts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XIQ4oJmO1nogrw4BI4xTnQ_JoWCMJsp";

export async function restSelect<T>(table: string, params: URLSearchParams): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${table} select failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T[];
}
