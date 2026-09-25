/**
 * Extracts the genuine client IP address across various CDN and Reverse Proxy configurations
 * (Cloudflare, Vercel Edge, AWS CloudFront, NGINX).
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Cloudflare header (highest priority when behind Cloudflare)
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // Standard X-Forwarded-For header: first IP is the original client
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  // Nginx / generic reverse proxy header
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  // Localhost fallback
  return "127.0.0.1";
}
