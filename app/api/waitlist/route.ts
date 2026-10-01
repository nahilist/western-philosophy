import { waitlistSchema } from "@/lib/validations/waitlist";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { createRequestFingerprint } from "@/lib/security/fingerprint";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  jsonError,
  jsonSuccess,
  rateLimitHeaders,
  requestBodyErrorResponse,
} from "@/lib/server/http";
import { readJsonBody, RequestBodyError } from "@/lib/server/request";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`waitlist:${clientIp}`, {
      windowSeconds: 600,
      maxRequests: 5,
    });
    const limitHeaders = rateLimitHeaders(rateLimit);

    if (!rateLimit.success) {
      return jsonError("Too many signup attempts. Please try again later.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        ...limitHeaders,
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const body = await readJsonBody(request, 4_096);
    if (
      typeof body === "object" &&
      body !== null &&
      "honeypot" in body &&
      String(body.honeypot).trim().length > 0
    ) {
      return jsonSuccess({ message: "You have been added to the early access list." }, 200, limitHeaders);
    }

    const validation = waitlistSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid signup.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten(),
        limitHeaders
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return jsonError(
        "Waitlist service is not configured.",
        "SERVICE_UNAVAILABLE",
        503,
        undefined,
        limitHeaders
      );
    }

    const { data, error } = await admin
      .from("waitlist_members")
      .insert({
        email: validation.data.email,
        source: validation.data.source,
        request_fingerprint: createRequestFingerprint(request),
      })
      .select("id, created_at")
      .single();

    if (error?.code === "23505") {
      return jsonSuccess(
        { message: "You are already registered.", alreadyRegistered: true },
        200,
        limitHeaders
      );
    }
    if (error) {
      console.error("[Waitlist API] Database insert failed", error.code);
      return jsonError("Unable to join the waitlist.", "DATABASE_ERROR", 503, undefined, limitHeaders);
    }

    return jsonSuccess(
      {
        id: data.id,
        created_at: data.created_at,
        message: "Welcome. You are on the priority access list.",
      },
      201,
      limitHeaders
    );
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Waitlist API] Unexpected failure", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
