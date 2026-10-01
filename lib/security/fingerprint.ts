import "server-only";

import { createHmac } from "node:crypto";
import { getClientIp } from "./client-ip";

function getFingerprintSecret() {
  const secret =
    process.env.VOTER_HASH_SECRET ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") return "development-only-voter-secret-change-me";
  return null;
}
export function createRequestFingerprint(request: Request): string | null {
  const secret = getFingerprintSecret();
  if (!secret) return null;

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent")?.slice(0, 512) ?? "unknown";
  const language = request.headers.get("accept-language")?.slice(0, 128) ?? "unknown";

  return createHmac("sha256", secret)
    .update(`${ip}\n${userAgent}\n${language}`)
    .digest("hex");
}
export function createAnonymousVoterId(request: Request): string | null {
  const fingerprint = createRequestFingerprint(request);
  return fingerprint ? `anon:${fingerprint}` : null;
}
