import { NextResponse } from "next/server";
import { createServerSideClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Production Health Check Probe
 * Endpoint: GET /api/health
 * 
 * Used by uptime monitors (UptimeRobot, Datadog, BetterStack) and container orchestrators
 * to verify web server responsiveness, database connection health, and memory stats.
 */
export async function GET() {
  const startTime = Date.now();
  const uptime = Math.floor(process.uptime());
  const memory = process.memoryUsage();

  let dbStatus: "connected" | "disconnected" | "demo_mode" = "demo_mode";
  let dbLatencyMs: number | null = null;
  let dbError: string | null = null;

  try {
    const supabase = await createServerSideClient();

    if (supabase) {
      const dbStart = Date.now();
      // Lightweight ping to database to verify connection pooler responsiveness
      const { error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .limit(1);

      dbLatencyMs = Date.now() - dbStart;

      if (error && error.code !== "PGRST116") {
        dbStatus = "disconnected";
        dbError = error.message;
      } else {
        dbStatus = "connected";
      }
    }
  } catch (err: unknown) {
    dbStatus = "disconnected";
    dbError = err instanceof Error ? err.message : "Unknown database error";
  }

  const isHealthy = dbStatus !== "disconnected";
  const statusCode = isHealthy ? 200 : 503;

  const payload = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: uptime,
    environment: process.env.NODE_ENV || "development",
    totalResponseTimeMs: Date.now() - startTime,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: dbError,
    },
    system: {
      heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
      rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
    },
  };

  return NextResponse.json(payload, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
