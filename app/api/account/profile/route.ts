import { profileUpdateSchema } from "@/lib/validations/account";
import { requireAuthenticatedUser } from "@/lib/server/auth";
import { jsonError, jsonSuccess, requestBodyErrorResponse } from "@/lib/server/http";
import { readJsonBody, RequestBodyError } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, favorite_tradition, created_at, updated_at")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) return jsonError("Unable to load profile.", "DATABASE_ERROR", 500);

  return jsonSuccess(
    data ?? {
      id: auth.user.id,
      email: auth.user.email ?? "",
      full_name:
        auth.user.user_metadata?.full_name ?? auth.user.email?.split("@")[0] ?? "Philosopher",
      avatar_url: auth.user.user_metadata?.avatar_url ?? null,
      favorite_tradition: "Rationalism",
      created_at: auth.user.created_at,
      updated_at: auth.user.updated_at ?? auth.user.created_at,
    }
  );
}
export async function PATCH(request: Request) {
  try {
    const auth = await requireAuthenticatedUser();
    if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

    const rateLimit = await checkRateLimit(`account:profile:${auth.user.id}`, {
      windowSeconds: 60,
      maxRequests: 20,
    });
    if (!rateLimit.success) {
      return jsonError("Too many profile updates.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const validation = profileUpdateSchema.safeParse(await readJsonBody(request, 4_096));
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid profile data.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten()
      );
    }

    const { data, error } = await auth.supabase
      .from("profiles")
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq("id", auth.user.id)
      .select("id, email, full_name, avatar_url, favorite_tradition, created_at, updated_at")
      .single();

    if (error) return jsonError("Unable to update profile.", "DATABASE_ERROR", 500);
    return jsonSuccess(data);
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Account Profile] PATCH failed", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
