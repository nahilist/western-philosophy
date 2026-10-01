import { dilemmaVoteSchema } from "@/lib/validations/dilemma";
import { slugSchema } from "@/lib/validations/account";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { createAnonymousVoterId } from "@/lib/security/fingerprint";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSideClient } from "@/lib/supabase/server";
import {
  jsonError,
  jsonSuccess,
  rateLimitHeaders,
  requestBodyErrorResponse,
} from "@/lib/server/http";
import { readJsonBody, RequestBodyError } from "@/lib/server/request";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const parsedId = slugSchema.safeParse(new URL(request.url).searchParams.get("dilemmaId"));
  if (!parsedId.success) {
    return jsonError("Valid dilemma identifier is required.", "INVALID_DILEMMA_ID", 400);
  }

  const rateLimit = await checkRateLimit(`dilemma:read:${getClientIp(request)}`, {
    windowSeconds: 60,
    maxRequests: 120,
  });
  if (!rateLimit.success) {
    return jsonError("Too many poll requests.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
      "Retry-After": String(rateLimit.resetSeconds),
    });
  }

  const admin = createAdminClient();
  if (!admin) return jsonError("Voting service is not configured.", "SERVICE_UNAVAILABLE", 503);

  const { data, error } = await admin.rpc("get_dilemma_stats", {
    p_dilemma_id: parsedId.data,
  });
  if (error) {
    console.error("[Dilemma API] Stats query failed", error.code);
    return jsonError("Unable to load voting statistics.", "DATABASE_ERROR", 503);
  }

  return jsonSuccess(data, 200, rateLimitHeaders(rateLimit));
}
export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`dilemma:write:${clientIp}`, {
      windowSeconds: 60,
      maxRequests: 20,
    });
    const limitHeaders = rateLimitHeaders(rateLimit);
    if (!rateLimit.success) {
      return jsonError("Voting rate limit exceeded.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        ...limitHeaders,
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const validation = dilemmaVoteSchema.safeParse(await readJsonBody(request, 4_096));
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid vote.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten(),
        limitHeaders
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return jsonError("Voting service is not configured.", "SERVICE_UNAVAILABLE", 503, undefined, limitHeaders);
    }

    const sessionClient = await createServerSideClient();
    const { data: userData } = sessionClient
      ? await sessionClient.auth.getUser()
      : { data: { user: null } };
    const user = userData.user;
    const voterIdentifier = user ? `user:${user.id}` : createAnonymousVoterId(request);
    if (!voterIdentifier) {
      return jsonError("Voter identity service is not configured.", "SERVICE_UNAVAILABLE", 503);
    }

    const { error } = await admin.from("dilemma_votes").upsert(
      {
        voter_identifier: voterIdentifier,
        dilemma_id: validation.data.dilemma_id,
        selected_choice: validation.data.selected_choice,
        user_id: user?.id ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "voter_identifier,dilemma_id" }
    );
    if (error) {
      console.error("[Dilemma API] Vote upsert failed", error.code);
      return jsonError("Unable to record vote.", "DATABASE_ERROR", 503, undefined, limitHeaders);
    }

    const { data: stats, error: statsError } = await admin.rpc("get_dilemma_stats", {
      p_dilemma_id: validation.data.dilemma_id,
    });
    if (statsError) console.error("[Dilemma API] Stats refresh failed", statsError.code);

    return jsonSuccess(
      {
        message: "Vote recorded successfully.",
        selected_choice: validation.data.selected_choice,
        stats: statsError ? null : stats,
      },
      200,
      limitHeaders
    );
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Dilemma API] Unexpected failure", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
