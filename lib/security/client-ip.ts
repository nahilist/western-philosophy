import "server-only";

import { isIP } from "node:net";

function validIp(value: string | null): string | null {
  const candidate = value?.trim();
  return candidate && isIP(candidate) ? candidate : null;
}

/**
 * Extracts the genuine client IP address across various CDN and Reverse Proxy configurations
 * (Cloudflare, Vercel Edge, AWS CloudFront, NGINX).
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Cloudflare header (highest priority when behind Cloudflare)
  const cfIp = validIp(headers.get("cf-connecting-ip"));
  if (cfIp) return cfIp;

  const vercelIp = validIp(headers.get("x-vercel-forwarded-for")?.split(",")[0] ?? null);
  if (vercelIp) return vercelIp;

  // Standard X-Forwarded-For header: first IP is the original client
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = validIp(xForwardedFor.split(",")[0] ?? null);
    if (firstIp) return firstIp;
  }

  // Nginx / generic reverse proxy header
  const xRealIp = validIp(headers.get("x-real-ip"));
  if (xRealIp) return xRealIp;

  // Localhost fallback
  return "127.0.0.1";
}
