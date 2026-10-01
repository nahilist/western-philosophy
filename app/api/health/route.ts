import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startedAt = performance.now();
  const admin = createAdminClient();
  let databaseStatus: "connected" | "unavailable" | "unconfigured" = admin
    ? "unavailable"
    : "unconfigured";
  let databaseLatencyMs: number | null = null;

  if (admin) {
    const databaseStartedAt = performance.now();
    const { error } = await admin.from("profiles").select("id", { head: true }).limit(1);
    databaseLatencyMs = Math.round((performance.now() - databaseStartedAt) * 100) / 100;
    databaseStatus = error ? "unavailable" : "connected";
    if (error) console.error("[Health] Database check failed", error.code);
  }

  const healthy = databaseStatus === "connected";
  const configuredSecret = process.env.HEALTHCHECK_SECRET?.trim();
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const showDiagnostics =
    process.env.NODE_ENV !== "production" ||
    Boolean(configuredSecret && suppliedSecret === configuredSecret);

  const payload = {
    status: healthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    checks: {
      application: "available",
      database: databaseStatus,
    },
    responseTimeMs: Math.round((performance.now() - startedAt) * 100) / 100,
    ...(showDiagnostics
      ? {
          diagnostics: {
            databaseLatencyMs,
            uptimeSeconds: Math.floor(process.uptime()),
            environment: process.env.NODE_ENV,
            nodeVersion: process.version,
          },
        }
      : {}),
  };

  return NextResponse.json(payload, {
    status: healthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export async function HEAD(request: Request) {
  const response = await GET(request);
  return new Response(null, { status: response.status, headers: response.headers });
}
