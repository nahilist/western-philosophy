import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { createServerSideClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/types/api";

export const dynamic = "force-dynamic";

/**
 * Contact Inquiry Submission Endpoint
 * POST /api/contact
 */
export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting Check (5 submissions per 10 minutes per IP)
    const rateLimit = await checkRateLimit(`contact:${clientIp}`, {
      windowSeconds: 600,
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        apiError(
          `Too many inquiries submitted. Please wait ${rateLimit.resetSeconds} seconds before trying again.`,
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

    // 2. Parse & Validate Request Body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        apiError("Invalid request body. JSON payload expected.", "INVALID_JSON"),
        { status: 400 }
      );
    }

    // 3. Honeypot check (Automated Bot Trap)
    // If the hidden honeypot field is filled, pretend success to deceive spam bots
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      console.warn(`[Bot Defense] Spambot trapped via honeypot from IP ${clientIp}`);
      return NextResponse.json(
        apiSuccess({ message: "Inquiry received successfully." }),
        { status: 200 }
      );
    }

    // 4. Strict Zod Schema Validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        apiError(firstError, "VALIDATION_ERROR", validation.error.format()),
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // 5. Forward Submission to Web3Forms
    const web3ApiKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      "eb458e86-ef08-4398-890b-27cee0c347d9";

    try {
      const web3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({
          access_key: web3ApiKey,
          name,
          email,
          replyto: email,
          subject: subject || "New Contact Inquiry - Western Philosophy",
          message,
          from_name: "Western Philosophy Academy",
        }),
      });

      const web3Json = await web3Res.json().catch(() => null);
      if (!web3Res.ok || (web3Json && !web3Json.success)) {
        console.warn("[Contact API] Web3Forms response warning:", web3Json);
      }
    } catch (web3Err) {
      console.error("[Contact API] Web3Forms submission failed:", web3Err);
    }

    // 6. Database Persistence (Supabase PostgreSQL)
    const supabase = await createServerSideClient();

    if (supabase) {
      const { data, error: dbError } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          subject,
          message,
          ip_address: clientIp,
          status: "unread",
        })
        .select("id, created_at")
        .single();

      if (dbError) {
        console.error("[Contact API] Supabase insert failed:", dbError);
      }

      return NextResponse.json(
        apiSuccess({
          id: data?.id || `msg-${Date.now()}`,
          message: "Thank you for reaching out. We have received your inquiry.",
        }),
        { status: 201 }
      );
    }

    // Fallback in demo/offline mode
    console.info(`[Demo Mode] Contact message from ${name} (${email}): ${subject}`);
    return NextResponse.json(
      apiSuccess({
        id: `demo-${Date.now()}`,
        message: "Your inquiry was logged successfully in demonstration mode.",
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unexpected server error";
    console.error("[Contact API] Uncaught exception:", errorMsg);
    return NextResponse.json(
      apiError("An internal server error occurred while processing your request.", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
