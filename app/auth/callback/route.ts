import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSafeRedirectOrigin(requestOrigin: string) {
  if (process.env.NODE_ENV !== "production") return requestOrigin;

  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredOrigin) return requestOrigin;

  try {
    return new URL(configuredOrigin).origin;
  } catch {
    console.error("NEXT_PUBLIC_SITE_URL is not a valid absolute URL.");
    return requestOrigin;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (supabaseUrl && supabaseAnonKey) {
      const safeOrigin = getSafeRedirectOrigin(origin);
      const redirectUrl = `${safeOrigin}${next}`;

      const response = NextResponse.redirect(redirectUrl);

      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get("cookie") || "";
            return cookieHeader
              .split(";")
              .map((c) => c.trim())
              .filter(Boolean)
              .map((c) => {
                const [name, ...val] = c.split("=");
                return { name, value: val.join("=") };
              });
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return response;
      }
      console.error("Supabase OAuth code exchange error:", error);
    }
  }

  // Redirect to home if code exchange fails or code is absent
  return NextResponse.redirect(`${origin}${next}`);
}
