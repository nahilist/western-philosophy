# Backend implementation status

The repository backend is code-complete for the product features currently used by the UI.

## Verification

- Next.js 16 production build passes.
- TypeScript validation passes with no errors.
- Backend/security ESLint checks pass.
- API smoke tests confirm protected routes reject anonymous access, invalid payloads
  return structured `400` responses, and readiness returns `503` while the required
  server-only Supabase credential is absent.

## Implemented

- Supabase cookie-based authentication with Next.js 16 Proxy refresh.
- Safe OAuth callback redirect handling.
- Server-only Supabase administrative client for public submissions.
- Authenticated profile, progress, bookmark, and reflection APIs.
- Contact, waitlist, dilemma voting, and health APIs.
- Zod validation and strict request-body size limits on every mutation.
- Honeypot protection and per-route rate limits.
- Optional distributed Upstash Redis rate limiting with local development fallback.
- HMAC-based anonymous voter deduplication without storing raw identifiers.
- Standard success/error API envelopes and no-store response headers.
- Explicit PostgreSQL grants, FORCE RLS, ownership policies, indexes, constraints,
  deduplication, and update timestamp triggers.
- CSP, HSTS in production, clickjacking, MIME-sniffing, referrer, permissions,
  and cross-origin security headers.
- Development-only local storage fallback; production never reports fake persistence.

## API surface

| Method | Route | Purpose |
| --- | --- | --- |
| GET/PATCH | `/api/account/profile` | Read/update the signed-in profile |
| GET/PUT | `/api/account/progress` | Read/upsert course progress |
| GET/POST | `/api/account/bookmarks` | List/toggle bookmarks |
| GET/POST/DELETE | `/api/account/reflections` | Manage private reflections |
| POST | `/api/contact` | Persist an inquiry and optionally notify Web3Forms |
| POST | `/api/waitlist` | Deduplicated waitlist signup |
| GET/POST | `/api/dilemma/vote` | Poll stats and deduplicated voting |
| GET/HEAD | `/api/health` | Application/database readiness probe |

## Required deployment actions

1. Add the variables documented in `.env.example` to the hosting provider.
   Remove the obsolete `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` variable; only the server-only
   `WEB3FORMS_ACCESS_KEY` is used.
2. Apply migrations `0001`, `0002`, and `0003` to the production Supabase project.
3. Configure Supabase Auth redirect URLs for `/auth/callback`.
4. Configure an OAuth provider and production SMTP if those login methods are enabled.
5. Configure Upstash for distributed production rate limiting.
6. Point an uptime monitor at `/api/health` and provide `HEALTHCHECK_SECRET` when
   detailed diagnostics are needed.

External credentials, migration execution against the production project, OAuth provider
secrets, SMTP, backups, and monitoring accounts cannot be created from repository code.
