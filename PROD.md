# 🚀 Western Philosophy Academy — Production Readiness & Deployment Guide

> **Document Version**: 2.0.0-PROD  
> **Classification**: Production Runbook & Engineering Standards  
> **Target Environment**: Multi-Region Edge + Supabase Cloud (PostgreSQL 16)  

---

## 1. Production Readiness Audit Matrix

Before pointing custom DNS domains or accepting live end-users, every checkbox in this matrix must be signed off by engineering.

### 🔴 P0: Critical Launch Blockers (Must Have)
- [ ] **Real Supabase Production Project Created**: Dedicated production project created (separate from development/staging).
- [ ] **Production Migration Executed**: `supabase/schema.sql` applied to production database.
- [ ] **Row Level Security (RLS) Enforced**: Every single public table verified with `alter table ... force row level security;`.
- [ ] **No Service Key Exposure**: Verified that `SUPABASE_SERVICE_ROLE_KEY` is NEVER prefixed with `NEXT_PUBLIC_` and never imported into client components.
- [ ] **Environment Variables Loaded**: Production environment secrets loaded in Vercel/Hosting Provider with zero placeholders.
- [ ] **Production Next.js Build**: `npm run build` passes with 0 TypeScript and 0 linting errors.
- [ ] **HTTPS / HSTS Configured**: Valid SSL/TLS certificate with automatic HTTP-to-HTTPS redirection.

### 🟡 P1: High Priority (Within 48h of Launch)
- [ ] **Rate Limiting Implemented**: Edge rate-limiting active on `/api/contact`, `/api/waitlist`, and auth endpoints.
- [ ] **Health Check Monitoring**: `/api/health` wired to external uptime monitor (e.g., UptimeRobot, BetterStack, Datadog) with < 1 min ping frequency.
- [ ] **Automated Daily Database Backups**: Supabase PITR (Point-in-Time Recovery) enabled.
- [ ] **Security Headers Applied**: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy configured in `next.config.ts`.
- [ ] **Email Delivery Configured**: Custom SMTP / Resend / SendGrid verified for Supabase Auth magic links and passwordless sign-ins (default Supabase test mailer has strict rate limits of 3 emails/hour).

### 🟢 P2: Operational Excellence (Scaling & Maintenance)
- [ ] **Error Tracking & APM**: Sentry / Axiom integrated for real-time error alerts and unhandled rejection tracing.
- [ ] **Static Asset CDN Caching**: Cloudflare / Vercel Edge caching rules configured for `/public/images` and `/design_assets` with `Cache-Control: public, max-age=31536000, immutable`.
- [ ] **Database Connection Pool Scaling**: Verified connection string uses Supavisor transaction pooler (`port 6543`) for serverless functions.

---

## 2. Environment Variables & Secret Management

### Production Configuration Specification

```env
# ==============================================================================
# 🌐 PUBLIC ENVIRONMENT VARIABLES (Available to Client & Browser)
# ==============================================================================
NEXT_PUBLIC_SITE_URL=https://westernphilosophy.academy
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROD_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_ENV=production

# ==============================================================================
# 🔒 PRIVATE BACKEND SECRETS (SERVER RUNTIME ONLY — NEVER EXPOSE TO CLIENT)
# ==============================================================================
# Supabase Service Role Key (Bypasses RLS for secure admin migrations / cron tasks)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PostgreSQL Connection Pooling String (Transaction Mode via Supavisor port 6543)
DATABASE_URL=postgresql://postgres.[YOUR_PROD_PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct Connection String (For running database migrations only — port 5432)
DIRECT_URL=postgresql://postgres.[YOUR_PROD_PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# Edge Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://[YOUR_REDIS_URL].upstash.io
UPSTASH_REDIS_REST_TOKEN=[YOUR_REDIS_TOKEN]

# Monitoring & Error Tracking
SENTRY_DSN=https://[KEY]@o[ORG].ingest.sentry.io/[PROJECT]
```

> [!CAUTION]
> **Strict Rule**: Any environment variable prefixed with `NEXT_PUBLIC_` is included in the compiled JavaScript browser bundle. Never prefix database passwords, Redis tokens, or `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.

---

## 3. Database Production Hardening

### 3.1. Connection Pooling with Supavisor
Next.js serverless functions scale rapidly with incoming traffic. If 500 concurrent users hit the site, serverless functions can open 500 direct database connections, instantly exhausting PostgreSQL's `max_connections` limit.

- **Solution**: Connect via Supabase's **Supavisor Transaction Pooler** (Port `6543`).
- In `DATABASE_URL`, append `?pgbouncer=true` to instruct database clients not to cache prepared statement names across transactions.

### 3.2. Automated Nightly Vacuum & Maintenance
Ensure auto-vacuuming is active in PostgreSQL:
```sql
-- Verify autovacuum status
SELECT name, setting FROM pg_settings WHERE name LIKE 'autovacuum%';
```

### 3.3. Database Backup & Disaster Recovery (PITR)
- **Supabase Cloud**: Enable **PITR (Point-in-Time Recovery)** in *Project Settings -> Database -> Backups*. This allows rewinding the database to any exact second within the last 7 to 28 days in case of accidental data truncation or ransomware.
- **Manual Cold Snapshot**: Weekly scheduled dump via GitHub Actions workflow or CLI:
  ```bash
  supabase db dump -f prod_backup_$(date +%F).sql --linked
  ```

---

## 4. Security & Edge Hardening

### 4.1. Security Headers (`next.config.ts`)
To protect against Cross-Site Scripting (XSS), Clickjacking, and MIME-sniffing, configure HTTP response headers:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  }
];
```

### 4.2. Rate Limiting Strategy
- **Waitlist & Contact Forms**: Max 5 requests per IP per 10-minute window.
- **Auth Endpoints (Login / OTP)**: Max 5 attempts per IP per 15-minute window to block credential stuffing.
- **Course Progress & Bookmark Mutations**: Max 60 requests per minute per authenticated user ID.

---

## 5. Health Check & Observability Specification

### 5.1. `/api/health` Endpoint
Production platforms must expose a deterministic health-check route:
- **Status 200 (OK)**: Web server responsive, PostgreSQL reachable, memory within safety threshold.
- **Status 503 (Degraded/Error)**: Database unreachable or severe pool exhaustion.

Response format:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-26T01:25:00.000Z",
  "uptime": 86420,
  "database": {
    "status": "connected",
    "latency_ms": 14
  },
  "environment": "production"
}
```

---

## 6. Incident Runbook & Emergency Procedures

### Scenario A: Supabase Connection Pool Exhaustion (HTTP 500 / 503)
1. **Diagnosis**: Check Supabase Dashboard -> *Reports -> Database*. If connection graph hits 100%, connections are stuck.
2. **Immediate Remediation**:
   - Terminate idle connections:
     ```sql
     SELECT pg_terminate_backend(pid) 
     FROM pg_stat_activity 
     WHERE state = 'idle in transaction' 
       AND state_change < now() - INTERVAL '5 minutes';
     ```
   - Verify server components are using transaction pooler (`aws-0-[region].pooler.supabase.com:6543`) rather than direct port `5432`.

### Scenario B: Accidental Exposure of Anon or Service Key
1. **Step 1**: Go to Supabase Dashboard -> *Project Settings -> API*.
2. **Step 2**: Click **"Roll API Keys"** (generates fresh keys immediately).
3. **Step 3**: Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Environment Variables.
4. **Step 4**: Trigger an instant production redeploy (`git commit --allow-empty` or redeploy button in Vercel).

### Scenario C: High Bot Traffic / Form Spam
1. Enable Cloudflare Under Attack mode or Turnstile challenge on `/api/contact` and `/api/waitlist`.
2. Inspect `public.waitlist_members` for anomalous duplicate IP submissions.
