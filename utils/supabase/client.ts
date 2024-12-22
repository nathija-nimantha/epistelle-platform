import { createBrowserClient } from "@supabase/ssr";

export const createClient = (p0?: { headers: { cookie: string; }; }) =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
