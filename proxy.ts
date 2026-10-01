import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

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

  const { url, key, isConfigured } = getSupabasePublicConfig();
  if (!isConfigured) return response;

  try {
    const supabase = createServerClient(url, key, {
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

    // Verify the token signature and refresh cookies when necessary.
    const { data } = await supabase.auth.getClaims();

    if (request.nextUrl.pathname.startsWith("/account") && !data?.claims?.sub) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.searchParams.set("auth", "required");
      return NextResponse.redirect(redirectUrl);
    }
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
