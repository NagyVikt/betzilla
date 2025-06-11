// lib/supabase-server.ts
import { createClient } from "@supabase/supabase-js";

// Use your SUPABASE_URL and SERVICE_ROLE key here
export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      // pass through cookies for SSR auth
      global: { headers: { cookie: "" } },
    }
  );
