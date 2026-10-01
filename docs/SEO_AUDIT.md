# Technical SEO audit — 2026-10-01

## Executive summary

The production site responded with HTTP 200, but its deployed homepage had no canonical, JSON-LD, Open Graph metadata, or Twitter card. Both `/robots.txt` and `/sitemap.xml` returned 404. The repository also lacked a crawlable philosopher directory, explicit trust pages, a manifest, and an automated SEO validation step.

The repository now contains the P0 and P1 technical foundation. These improvements become public only after this branch is deployed.

| Area | Before | After | Status |
| --- | --- | --- | --- |
| Metadata | One generic root title/description | Shared defaults plus unique route and philosopher metadata | Complete |
| Sitemap | Production 404 | Dynamic sitemap with 22 canonical URLs and entity images | Complete |
| Robots | Production 404 | Public crawl rules; account/API/auth excluded | Complete |
| Canonicals | Missing in deployed homepage | Self-referencing canonicals on indexable routes | Complete |
| Schema | No JSON-LD detected | WebSite, Organization, WebPage, Person, Course, CollectionPage, ItemList, BreadcrumbList | Complete |
| Internal linking | Homepage sections and course links | Crawlable philosopher hub, breadcrumbs, trust links, adjacent guides | Complete |
| GEO | No explicit entity graph | Atomic summaries, entity relationships, source trail, coherent schema graph | Complete |
| AEO | Rich prose without consistent direct identity answer | Entity H1 and direct above-fold summary on every philosopher guide | Complete |
| Hreflang | None | Correctly deferred until real Hindi URLs exist | Pending content |
| Images | Mixed legacy raster assets | Responsive WebP entity images and image sitemap references | Complete |
| Error semantics | Default handling | Unknown philosopher returns 404; custom 404/error/loading UI | Complete |
| Quality guard | None | Typecheck, lint, build, and `seo:audit` pass | Complete |

## Critical findings addressed

1. Missing production robots and sitemap endpoints.
2. Missing canonical and social metadata.
3. No structured entity data for philosopher/course pages.
4. Philosopher H1 described a quotation rather than the philosopher entity.
5. No HTML-linked collection route for all 14 philosopher guides.
6. Private account pages were not explicitly marked noindex.
7. No visible editorial, methodology, correction, or source-selection policy.
8. No automated guard for missing entity images, duplicate slugs, or critical SEO files.

## Validation evidence

- Next.js 16 production build completed successfully with 33 generated routes.
- TypeScript completed with no errors.
- ESLint completed with no errors; legacy unused-code warnings remain non-blocking.
- The SEO audit validated 14 philosopher slugs and 14 referenced images.
- Local production rendering returned 200 for public pages and 404 for an unknown philosopher.
- Rendered philosopher HTML contains a canonical, JSON-LD, H1, Open Graph metadata, and Twitter metadata.

## Human review required

- Verify every quotation against a specific edition and translator.
- Review philosophical school labels where scholarly classifications are contested.
- Confirm copyright/licensing for every portrait and artwork.
- Add a genuine named maintainer/editor only if that identity is intended to be public.
- Produce human-reviewed Hindi content before creating `/hi` routes or hreflang.

## Deployment and search-engine actions

1. Deploy the branch and confirm the production metadata matches the local build.
2. Verify ownership in Google Search Console and Bing Webmaster Tools.
3. Submit `https://western-philosophy.vercel.app/sitemap.xml` to both services.
4. Inspect `/`, `/philosophers`, and representative `/course/[slug]` pages.
5. Run Google Rich Results Test and Schema.org Validator against deployed URLs.
6. Monitor Page Indexing and Core Web Vitals; do not request indexing for private routes.
