import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validations/waitlist";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { createServerSideClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/types/api";

export const dynamic = "force-dynamic";

/**
 * Waitlist / Early Access Subscription Endpoint
 * POST /api/waitlist
 */
export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting Check (5 signups per 10 minutes per IP)
    const rateLimit = await checkRateLimit(`waitlist:${clientIp}`, {
      windowSeconds: 600,
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        apiError(
          `Too many subscription attempts. Please wait ${rateLimit.resetSeconds} seconds.`,
          "RATE_LIMIT_EXCEEDED"
        ),
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        apiError("Invalid request body. JSON payload expected.", "INVALID_JSON"),
        { status: 400 }
      );
    }

    // 3. Honeypot check
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      console.warn(`[Bot Defense] Spambot trapped on waitlist from IP ${clientIp}`);
      return NextResponse.json(
        apiSuccess({ message: "You have been added to the early access list." }),
        { status: 200 }
      );
    }

    // 4. Zod Validation
    const validation = waitlistSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        apiError(firstError, "VALIDATION_ERROR", validation.error.format()),
        { status: 400 }
      );
    }

    const { email, source } = validation.data;

    // 5. Database Persistence
    const supabase = await createServerSideClient();

    if (supabase) {
      const { data, error: dbError } = await supabase
        .from("waitlist_members")
        .insert({
          email,
          source,
        })
        .select("id, created_at")
        .single();

      if (dbError) {
        // PostgreSQL unique violation code 23505 (duplicate email)
        if (dbError.code === "23505") {
          return NextResponse.json(
            apiSuccess({
              message: "You are already registered on our early access list!",
              alreadyRegistered: true,
            }),
            { status: 200 }
          );
        }

        console.error("[Waitlist API] Supabase insert error:", dbError);
        return NextResponse.json(
          apiError("Unable to register email at this time.", "DATABASE_ERROR"),
          { status: 500 }
        );
      }

      return NextResponse.json(
        apiSuccess({
          id: data.id,
          message: "Welcome to the Academy. You are on the priority access list.",
        }),
        { status: 201 }
      );
    }

    // Demo / Offline fallback
    console.info(`[Demo Mode] Waitlist signup for ${email} from ${source}`);
    return NextResponse.json(
      apiSuccess({
        id: `demo-${Date.now()}`,
        message: "You have been registered for early access in demo mode.",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unexpected server error";
    console.error("[Waitlist API] Uncaught exception:", errorMsg);
    return NextResponse.json(
      apiError("An internal server error occurred while processing your request.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
