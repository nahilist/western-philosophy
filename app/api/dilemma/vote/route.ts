import { NextResponse } from "next/server";
import { dilemmaVoteSchema } from "@/lib/validations/dilemma";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { createServerSideClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/types/api";

export const dynamic = "force-dynamic";

/**
 * GET /api/dilemma/vote?dilemmaId=<id>
 * Fetches community breakdown and vote counts for a dilemma.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dilemmaId = searchParams.get("dilemmaId")?.trim().toLowerCase();

    if (!dilemmaId || !/^[a-z0-9_-]{1,50}$/.test(dilemmaId)) {
      return NextResponse.json(
        apiError("Valid dilemma identifier is required.", "INVALID_DILEMMA_ID"),
        { status: 400 }
      );
    }

    const supabase = await createServerSideClient();

    if (supabase) {
      // Execute the optimized aggregation stored procedure
      const { data, error } = await supabase.rpc("get_dilemma_stats", {
        p_dilemma_id: dilemmaId,
      });

      if (!error && data) {
        return NextResponse.json(apiSuccess(data), { status: 200 });
      }

      // Fallback query if RPC isn't loaded yet
      const { data: votes, error: fetchErr } = await supabase
        .from("dilemma_votes")
        .select("selected_choice")
        .eq("dilemma_id", dilemmaId);

      if (!fetchErr && votes) {
        const total = votes.length;
        const counts: Record<string, number> = {};
        for (const v of votes) {
          counts[v.selected_choice] = (counts[v.selected_choice] || 0) + 1;
        }

        const stats = Object.entries(counts).map(([choice, count]) => ({
          choice,
          count,
          percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
        }));

        return NextResponse.json(apiSuccess({ total, stats }), { status: 200 });
      }
    }

    // Default simulation data for demo / offline mode
    return NextResponse.json(
      apiSuccess({
        total: 1240,
        stats: [
          { choice: "action", count: 780, percentage: 62.9 },
          { choice: "inaction", count: 460, percentage: 37.1 },
        ],
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(apiError(errorMsg, "INTERNAL_ERROR"), { status: 500 });
  }
}

/**
 * POST /api/dilemma/vote
 * Records or updates a user's vote on an ethical dilemma.
 */
export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting Check (20 votes per minute per IP)
    const rateLimit = await checkRateLimit(`dilemma:${clientIp}`, {
      windowSeconds: 60,
      maxRequests: 20,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        apiError(
          `Voting rate limit exceeded. Please wait ${rateLimit.resetSeconds} seconds.`,
          "RATE_LIMIT_EXCEEDED"
        ),
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        apiError("Invalid JSON body in vote request.", "INVALID_JSON"),
        { status: 400 }
      );
    }

    const validation = dilemmaVoteSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        apiError(firstError, "VALIDATION_ERROR", validation.error.format()),
        { status: 400 }
      );
    }

    const { dilemma_id, selected_choice } = validation.data;

    // 3. Resolve Voter Identifier (Authenticated UID or Secure Client Fingerprint)
    const supabase = await createServerSideClient();
    let userId: string | null = null;
    let voterIdentifier = validation.data.voter_identifier;

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        voterIdentifier = `user:${user.id}`;
      }
    }

    if (!voterIdentifier) {
      // Fallback fingerprint derived from IP + user-agent hash length
      const ua = request.headers.get("user-agent") || "unknown";
      voterIdentifier = `anon:${Buffer.from(`${clientIp}:${ua}`).toString("base64").slice(0, 32)}`;
    }

    // 4. Upsert Vote into Database
    if (supabase) {
      const { error: upsertErr } = await supabase
        .from("dilemma_votes")
        .upsert(
          {
            voter_identifier: voterIdentifier,
            dilemma_id,
            selected_choice,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "voter_identifier,dilemma_id" }
        );

      if (upsertErr) {
        console.error("[Dilemma Vote API] Upsert error:", upsertErr);
        return NextResponse.json(
          apiError("Failed to record vote in database.", "DATABASE_ERROR"),
          { status: 500 }
        );
      }

      // Fetch fresh aggregates to return to client
      const { data: statsData } = await supabase.rpc("get_dilemma_stats", {
        p_dilemma_id: dilemma_id,
      });

      return NextResponse.json(
        apiSuccess({
          message: "Vote recorded successfully.",
          selected_choice,
          stats: statsData || null,
        }),
        { status: 200 }
      );
    }

    // Demo Mode Response
    return NextResponse.json(
      apiSuccess({
        message: "Vote recorded in demo mode.",
        selected_choice,
        stats: {
          total: 1241,
          stats: [
            { choice: selected_choice, count: 781, percentage: 63.0 },
            { choice: "other", count: 460, percentage: 37.0 },
          ],
        },
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unexpected voting error";
    return NextResponse.json(apiError(errorMsg, "INTERNAL_ERROR"), { status: 500 });
  }
}
