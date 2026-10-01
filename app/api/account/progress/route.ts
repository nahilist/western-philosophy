import { progressUpdateSchema, slugSchema } from "@/lib/validations/account";
import { requireAuthenticatedUser } from "@/lib/server/auth";
import { jsonError, jsonSuccess, requestBodyErrorResponse } from "@/lib/server/http";
import { readJsonBody, RequestBodyError } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

  const courseId = new URL(request.url).searchParams.get("courseId");
  let query = auth.supabase
    .from("user_course_progress")
    .select("course_id, completed_modules, progress_percent, last_read_at")
    .eq("user_id", auth.user.id)
    .order("last_read_at", { ascending: false });

  if (courseId) {
    const parsed = slugSchema.safeParse(courseId);
    if (!parsed.success) return jsonError("Invalid course identifier.", "VALIDATION_ERROR", 400);
    query = query.eq("course_id", parsed.data);
  }

  const { data, error } = await query;
  if (error) return jsonError("Unable to load course progress.", "DATABASE_ERROR", 500);

  return jsonSuccess(courseId ? data?.[0] ?? null : data ?? []);
}
export async function PUT(request: Request) {
  try {
    const auth = await requireAuthenticatedUser();
    if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

    const rateLimit = await checkRateLimit(`account:progress:${auth.user.id}`, {
      windowSeconds: 60,
      maxRequests: 60,
    });
    if (!rateLimit.success) {
      return jsonError("Too many progress updates.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const validation = progressUpdateSchema.safeParse(await readJsonBody(request, 16_384));
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid progress data.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten()
      );
    }

    const payload = {
      ...validation.data,
      user_id: auth.user.id,
      last_read_at: new Date().toISOString(),
    };
    const { data, error } = await auth.supabase
      .from("user_course_progress")
      .upsert(payload, { onConflict: "user_id,course_id" })
      .select("course_id, completed_modules, progress_percent, last_read_at")
      .single();

    if (error) return jsonError("Unable to save course progress.", "DATABASE_ERROR", 500);
    return jsonSuccess(data);
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Account Progress] PUT failed", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
