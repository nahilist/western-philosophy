import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase Client
 * Use this in Server Components, Route Handlers, and Server Actions
 */
export async function createServerSideClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

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

  if (!isValidUrl || !isValidKey) {
    return null;
  }

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

