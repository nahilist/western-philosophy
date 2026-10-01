import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let adminClient: SupabaseClient | null = null;

/**
 * Service-key client for trusted Route Handlers only. It never reads user
 * cookies and must never be imported by a Client Component.
 */
export function createAdminClient(): SupabaseClient | null {
  const { url, isConfigured } = getSupabasePublicConfig();
  const secretKey = (
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  ).trim();
  if (!isConfigured || secretKey.length <= 20) return null;

  if (!adminClient) {
    adminClient = createClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
