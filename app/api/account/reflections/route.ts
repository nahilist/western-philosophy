import { reflectionCreateSchema, reflectionDeleteSchema } from "@/lib/validations/account";
import { requireAuthenticatedUser } from "@/lib/server/auth";
import { jsonError, jsonSuccess, requestBodyErrorResponse } from "@/lib/server/http";
import { readJsonBody, RequestBodyError } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

  const { data, error } = await auth.supabase
    .from("philosophical_reflections")
    .select("id, course_id, reflection_text, is_private, created_at, updated_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) return jsonError("Unable to load reflections.", "DATABASE_ERROR", 500);
  return jsonSuccess(data ?? []);
}
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser();
    if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

    const rateLimit = await checkRateLimit(`account:reflections:${auth.user.id}`, {
      windowSeconds: 60,
      maxRequests: 20,
    });
    if (!rateLimit.success) {
      return jsonError("Too many reflection submissions.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const validation = reflectionCreateSchema.safeParse(await readJsonBody(request, 12_288));
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid reflection data.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten()
      );
    }

    const { data, error } = await auth.supabase
      .from("philosophical_reflections")
      .insert({ ...validation.data, user_id: auth.user.id })
      .select("id, course_id, reflection_text, is_private, created_at, updated_at")
      .single();

    if (error) return jsonError("Unable to save reflection.", "DATABASE_ERROR", 500);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Account Reflections] POST failed", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedUser();
    if (!auth) return jsonError("Authentication required.", "UNAUTHORIZED", 401);

    const rateLimit = await checkRateLimit(`account:reflections:delete:${auth.user.id}`, {
      windowSeconds: 60,
      maxRequests: 30,
    });
    if (!rateLimit.success) {
      return jsonError("Too many reflection deletions.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const validation = reflectionDeleteSchema.safeParse(await readJsonBody(request, 2_048));
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid reflection identifier.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten()
      );
    }

    const { data, error } = await auth.supabase
      .from("philosophical_reflections")
      .delete()
      .eq("id", validation.data.reflection_id)
      .eq("user_id", auth.user.id)
      .select("id")
      .maybeSingle();

    if (error) return jsonError("Unable to delete reflection.", "DATABASE_ERROR", 500);
    if (!data) return jsonError("Reflection not found.", "NOT_FOUND", 404);
    return jsonSuccess({ deleted: true, id: data.id });
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Account Reflections] DELETE failed", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
