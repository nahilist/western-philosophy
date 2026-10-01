import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let browserClient: SupabaseClient | null = null;

/**
 * Client-side Supabase Client
 * Use this in React Client Components ("use client")
 */
export function createClient() {
  const { url, key, isConfigured } = getSupabasePublicConfig();

  if (isConfigured && !browserClient) {
    browserClient = createBrowserClient(url, key);
  }

  return {
    isConfigured,
    client: isConfigured ? browserClient : null,
  };
}

