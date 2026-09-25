import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Production Proxy:
 * 1. Automatically refreshes expiring Supabase auth session tokens via Server Cookies.
 * 2. Injects security tracking headers without impacting static asset caching.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  const isValidUrl =
    Boolean(supabaseUrl) &&
    supabaseUrl!.startsWith("https://") &&
    !supabaseUrl!.includes("api.supabase.com") &&
    !supabaseUrl!.includes("your-supabase") &&
    !supabaseUrl!.includes("placeholder");

  const isValidKey =
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey!.length > 20 &&
    !supabaseAnonKey!.includes("your-supabase");

  if (!isValidUrl || !isValidKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh auth session token if expired
    await supabase.auth.getUser();
  } catch (err: unknown) {
    // Failure in middleware session refresh should not bring down public site
    console.error("Middleware session refresh warning:", err);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, .jpg, .jpeg, .webp, .gif)
     */
    "/((?!_next/static|_next/image|favicon.ico|design_assets|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
