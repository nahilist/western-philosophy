import "server-only";

import { NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/types/api";
import type { RateLimitResult } from "@/lib/security/rate-limit";
import { RequestBodyError } from "./request";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(result.resetSeconds),
  };
}
export function jsonSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json(apiSuccess(data), {
    status,
    headers: { ...NO_STORE_HEADERS, ...headers },
  });
}
export function jsonError(
  message: string,
  code: string,
  status: number,
  details?: unknown,
  headers?: HeadersInit
) {
  return NextResponse.json(apiError(message, code, details), {
    status,
    headers: { ...NO_STORE_HEADERS, ...headers },
  });
}
export function requestBodyErrorResponse(error: RequestBodyError) {
  const status = error.code === "PAYLOAD_TOO_LARGE" ? 413 : 400;
  return jsonError(error.message, error.code, status);
}
