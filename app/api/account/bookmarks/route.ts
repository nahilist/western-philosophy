import { bookmarkToggleSchema } from "@/lib/validations/account";
import { requireAuthenticatedUser } from "@/lib/server/auth";
import { jsonError, jsonSuccess, requestBodyErrorResponse } from "@/lib/server/http";
import { readJsonBody, RequestBodyError } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

  const { data, error } = await auth.supabase
    .from("user_bookmarks")
    .select("id, course_id, quote_text, work_title, created_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) return jsonError("Unable to load bookmarks.", "DATABASE_ERROR", 500);
  return jsonSuccess(data ?? []);
}
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser();
    if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

    const rateLimit = await checkRateLimit(`account:bookmarks:${auth.user.id}`, {
      windowSeconds: 60,
      maxRequests: 30,
    });
    if (!rateLimit.success) {
      return jsonError("Too many bookmark actions.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const validation = bookmarkToggleSchema.safeParse(await readJsonBody(request, 8_192));
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid bookmark data.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten()
      );
    }

    const { data: existing, error: lookupError } = await auth.supabase
      .from("user_bookmarks")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("course_id", validation.data.course_id)
      .maybeSingle();

    if (lookupError) return jsonError("Unable to update bookmark.", "DATABASE_ERROR", 500);

    if (existing) {
      const { error } = await auth.supabase
        .from("user_bookmarks")
        .delete()
        .eq("id", existing.id)
        .eq("user_id", auth.user.id);
      if (error) return jsonError("Unable to remove bookmark.", "DATABASE_ERROR", 500);
      return jsonSuccess({ bookmarked: false, id: existing.id });
    }

    const { data, error } = await auth.supabase
      .from("user_bookmarks")
      .insert({ ...validation.data, user_id: auth.user.id })
      .select("id, course_id, quote_text, work_title, created_at")
      .single();

    if (error) return jsonError("Unable to save bookmark.", "DATABASE_ERROR", 500);
    return jsonSuccess({ bookmarked: true, bookmark: data }, 201);
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Account Bookmarks] POST failed", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
