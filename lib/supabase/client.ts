import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase Client
 * Use this in React Client Components ("use client")
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Validate that the URL is a genuine Supabase project endpoint
  // A genuine URL must be in format: https://<project-ref>.supabase.co
  // It must NOT be 'api.supabase.com', placeholders, or empty
  const isValidUrl =
    Boolean(supabaseUrl) &&
    supabaseUrl!.startsWith("https://") &&
    !supabaseUrl!.includes("api.supabase.com") &&
    !supabaseUrl!.includes("your-supabase") &&
    !supabaseUrl!.includes("your-project-ref") &&
    !supabaseUrl!.includes("placeholder");

  const isValidKey =
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey!.length > 20 &&
    !supabaseAnonKey!.includes("your-supabase") &&
    !supabaseAnonKey!.includes("your-project-key");

  const isConfigured = isValidUrl && isValidKey;

  return {
    isConfigured,
    client: isConfigured ? createBrowserClient(supabaseUrl!, supabaseAnonKey!) : null,
  };
}

