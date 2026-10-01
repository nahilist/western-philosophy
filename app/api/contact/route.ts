import { contactSchema } from "@/lib/validations/contact";
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
    const rateLimit = await checkRateLimit(`contact:${clientIp}`, {
      windowSeconds: 600,
      maxRequests: 5,
    });
    const limitHeaders = rateLimitHeaders(rateLimit);

    if (!rateLimit.success) {
      return jsonError("Too many inquiries. Please try again later.", "RATE_LIMIT_EXCEEDED", 429, undefined, {
        ...limitHeaders,
        "Retry-After": String(rateLimit.resetSeconds),
      });
    }

    const body = await readJsonBody(request, 8_192);
    if (
      typeof body === "object" &&
      body !== null &&
      "honeypot" in body &&
      String(body.honeypot).trim().length > 0
    ) {
      return jsonSuccess({ message: "Inquiry received successfully." }, 200, limitHeaders);
    }

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(
        validation.error.issues[0]?.message ?? "Invalid inquiry.",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten(),
        limitHeaders
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return jsonError(
        "Contact service is not configured.",
        "SERVICE_UNAVAILABLE",
        503,
        undefined,
        limitHeaders
      );
    }

    const { name, email, subject, message } = validation.data;
    const { data, error } = await admin
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
        status: "unread",
        request_fingerprint: createRequestFingerprint(request),
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[Contact API] Database insert failed", error.code);
      return jsonError("Unable to save inquiry.", "DATABASE_ERROR", 503, undefined, limitHeaders);
    }

    const web3ApiKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
    if (web3ApiKey) {
      try {
        const notificationResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3ApiKey,
            name,
            email,
            replyto: email,
            subject,
            message,
            from_name: "Western Philosophy Academy",
          }),
          signal: AbortSignal.timeout(5_000),
        });

        if (!notificationResponse.ok) {
          console.error(
            "[Contact API] Notification delivery failed",
            notificationResponse.status
          );
        }
      } catch (notificationError) {
        console.error("[Contact API] Notification delivery failed", notificationError);
      }
    }

    return jsonSuccess(
      {
        id: data.id,
        created_at: data.created_at,
        message: "Thank you. Your inquiry has been received.",
      },
      201,
      limitHeaders
    );
  } catch (error) {
    if (error instanceof RequestBodyError) return requestBodyErrorResponse(error);
    console.error("[Contact API] Unexpected failure", error);
    return jsonError("Internal server error.", "INTERNAL_ERROR", 500);
  }
}
