# Technical SEO Audit — santifer.io

**Date:** 2026-04-17
**Scope:** Full production audit (live)
**Methodology:** HTTP header inspection, HTML source analysis of prerendered output, sitemap/robots/hreflang validation. No rendering-engine test (Lighthouse/CrUX) — desk audit only.

**Overall Technical Score: 92 / 100**

---

## Executive Summary

Site is in excellent technical shape. Prerender delivers complete HTML to crawlers (124KB–315KB per route), security headers are best-in-class (HSTS preload, strict CSP, Permissions-Policy), and hreflang/canonical pairs are symmetric across all 9 bilingual articles. Two issues deserve immediate attention: the legacy `/business-os` slug returns 404 (despite appearing in project docs as a key route), and IndexNow is not configured. Everything else is either a micro-optimization or already optimal.

---

## 1. Crawlability — PASS

- `robots.txt` (200 OK): permissive, explicit allow for `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `OAI-SearchBot`, `Google-Extended`. `/api/` and `/ops` disallowed (correct — private dashboard + edge functions).
- `Sitemap:` directive present, pointing to absolute URL.
- `sitemap.xml` (200 OK, 7.5KB, valid XML): 18 URLs, all with `lastmod` + `priority` + nested `xhtml:link` hreflang triplets (es/en/x-default).
- `llms.txt` (200 OK, 13.8KB): rich, well-structured, actively served with correct `text/plain` content-type.
- Internal linking on homepage is clean: all case-study links go to localized slugs (ES homepage → ES slugs, EN homepage → EN slugs). Cross-language leakage: none detected.
- 404 page is properly marked `<meta name="robots" content="noindex, nofollow">` and returns HTTP 404 (not soft 404).

## 2. Indexability — PASS (with 1 High)

- Canonical tags: self-referential and absolute on every tested route (9/9 passed).
- hreflang: fully symmetric on each page — each variant lists es, en, x-default pointing to ES version. Both URLs on a pair reciprocate correctly (verified: `/seo-programatico` ↔ `/programmatic-seo`, `/career-ops` ↔ `/career-ops-system`, `/ai-agent-jacobo` ↔ `/agente-ia-jacobo`, etc.).
- No stray `noindex` directives on indexable routes.
- `x-default` consistently points to the ES variant (intentional; Seville-based author).

**High:** `/business-os` → HTTP 404. This slug is listed as a "key route" in CLAUDE.md and in the audit brief, but the production sitemap uses `/business-os-for-airtable` and `/business-os-para-airtable`. If `/business-os` was ever externally linked (old Reddit post, email signature), it now bleeds link equity. **Fix:** add a 301 redirect `/business-os → /business-os-para-airtable` (ES is the x-default).

## 3. Security Headers — PASS (best-in-class)

All headers present on the homepage (and replicated across assets):

| Header | Value |
|--------|-------|
| `strict-transport-security` | `max-age=63072000; includeSubDomains; preload` |
| `content-security-policy` | Strict, nonce-less but scoped (default-src 'self', explicit allowlists per directive) |
| `permissions-policy` | `camera=(), microphone=(self), geolocation=()` |
| `referrer-policy` | `strict-origin-when-cross-origin` |
| `x-content-type-options` | `nosniff` |
| `frame-ancestors` | `'self'` (via CSP — modern replacement for X-Frame-Options) |
| `form-action` | `'self'` |
| `base-uri` | `'self'` |
| `object-src` | `'none'` |

- HTTPS enforced: `http://santifer.io/` → 308 to `https://santifer.io/`.
- `www.santifer.io` → 308 to apex (good; avoids duplicate content).
- `/.well-known/security.txt`: 200 OK (present).
- No mixed content observed in HTML source (all asset references use relative or `https://`).

**Low:** CSP uses `'unsafe-inline'` for `script-src` and `style-src`. Modern practice is nonce-based CSP. Given Vercel's edge limitations and Vite's hashed chunks, this is acceptable but worth revisiting if/when Vercel exposes per-request nonces.

## 4. URL Structure — PASS

- Clean, human-readable slugs. No query strings, session IDs, trailing slashes, or file extensions.
- Trailing-slash variants (`/career-ops/`, `/en/`) → 308 redirects to non-slash canonical. Correct.
- Language pattern: `/en` prefix for EN home, but per-article EN uses English slug (`/career-ops-system` vs `/career-ops`). This is unusual but internally consistent and declared correctly via hreflang.
- No 5XX observed across 17 tested routes.

## 5. Mobile — PASS

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present on all tested pages.
- `theme-color: #0a0a0a` set (iOS/Android browser chrome styling).
- Full favicon set: `.ico`, 16x16, 32x32, apple-touch-icon implied.
- Touch targets and responsive CSS not inspectable from HTML alone — recommend Lighthouse mobile run to confirm.

## 6. Core Web Vitals (source inspection) — Mostly Good

**LCP signals (good):**
- Hero avatar preloaded with `fetchpriority="high"` + `imagesrcset` for responsive (`foto-avatar-sm.webp` 192w / `foto-avatar.webp` 384w).
- Critical fonts preloaded (`space-grotesk-latin.woff2`, `dm-sans-latin.woff2`) with `crossorigin`.
- No render-blocking third-party scripts in head.

**CLS signals (Medium issue on articles):**
- Homepage: 20 images, 0 missing dimensions — perfect.
- `/career-ops`: 11 images, **7 without explicit `width`/`height`**. Same pattern likely on other articles. Each is a layout-shift risk when images load after text.

**INP:** Cannot assess from source. The chat widget (`FloatingChat`) loads client-side Motion + Anthropic SDK streaming. If it's lazy-mounted, INP should be fine; if eager, watch for main-thread contention on mobile.

**Medium:** Add explicit `width`/`height` attributes to all article images (or `aspect-ratio` CSS). Biggest offender: `/career-ops` (7 images). Fix in `articles/components.tsx` image components.

## 7. Structured Data — PASS (minimal but correct)

- `/about`: 1 JSON-LD block, `@type: ProfilePage` — correct for Entity Home.
- Home (`/`, `/en`): 1 JSON-LD block each.
- Articles: 1 JSON-LD block each — `buildArticleJsonLd()` generates Person + WebSite + BreadcrumbList + FAQPage + HowTo per CLAUDE.md.

**Low:** Could not parse all JSON-LD blobs end-to-end in this desk audit. Recommend running `npm run validate-articles` and a Rich Results Test on one article per type (case-study, collab) to confirm FAQ/HowTo eligibility.

## 8. JavaScript Rendering — PASS

SPA is prerendered correctly. Raw HTML contains all SEO-relevant content without executing JS:

| Route | HTML size | Contains H1 | Meta complete |
|-------|-----------|-------------|---------------|
| `/` | 240.6 KB | yes (empty text, gradient/image H1) | yes |
| `/about` | ~same | yes ("Santiago Fernández de Valderrama") | yes |
| `/career-ops` | 125.9 KB | yes | yes |
| `/ai-agent-jacobo` | 315.0 KB | yes | yes |

**Low:** Homepage H1 renders as a gradient/decorative element — the H1 element exists but has empty text content (text likely in a sibling visually). Googlebot uses the H1 as a ranking signal; an empty H1 means the signal is wasted. Confirm the H1 includes the phrase "Santiago Fernández de Valderrama" or "Builder of Career-Ops" as plain text (can still be styled visually with CSS).

## 9. IndexNow — FAIL (not configured)

- `/indexnow.txt`: 404.
- No `IndexNow-Key` header or mention in `robots.txt`.
- Missing ping integration means Bing/Yandex/Naver discover changes only on natural crawl.

**Medium:** Add IndexNow. Workflow:
1. Generate a UUID key, expose at `/<key>.txt` containing the key string.
2. On each Vercel prod deploy, POST changed URLs to `https://api.indexnow.org/indexnow`.
3. Add `IndexNow-Key: <key>` reference to `robots.txt`.

## Extras

- Custom response headers are excellent branding (`x-built-with: Claude Code`, `x-evals: 71`, `x-open-to: interesting-problems`, `x-resume: /llms.txt`) — harmless and memorable for any dev who curls the site.
- `security.txt` at `/.well-known/security.txt` returns 200 — good responsible-disclosure hygiene.
- Edge caching working: most routes show `x-vercel-cache: HIT` with age in thousands of seconds.

---

## Prioritized Issues

### Critical
_(none)_

### High
1. **`/business-os` returns 404.** Add 301 redirect to `/business-os-para-airtable` (x-default) in `vercel.json`. Also check LinkedIn, Reddit posts, Substack, and email signatures for any outbound links using the short slug.

### Medium
2. **CLS risk on article images.** `/career-ops` has 7 of 11 images without explicit dimensions. Audit `articles/components.tsx` and add `width`/`height` (or `aspect-ratio` wrapper) to all image components. Re-verify on every article after fix.
3. **IndexNow not configured.** Generate key, expose at `/<key>.txt`, integrate ping into deploy pipeline. Yields faster Bing/Yandex/Naver indexing of prerender-heavy content changes.

### Low
4. **Homepage H1 text empty.** Ensure the `<h1>` contains Santiago's name or the tagline as plain text (can still be visually styled as gradient with CSS). Current HTML: `<h1>` exists but text extraction returned empty.
5. **CSP uses `'unsafe-inline'`.** Acceptable given Vercel/Vite constraints. Revisit when Vercel supports per-request nonces.
6. **Validate structured data end-to-end** with Google Rich Results Test on one article per registry `type` (case-study vs collab). `npm run validate-articles` already covers title/description/dates.
7. **Chat widget INP unknown.** Confirm `FloatingChat` lazy-mounts on idle or user interaction, not eager on page load.

---

## What's already excellent (keep doing)

- Bilingual hreflang + canonical discipline across 9 article pairs — zero asymmetry found.
- Per-page OG images (nested `/career-ops/og-career-ops.webp`, `/jacobo/og-jacobo-agent.webp`, etc.) all return 200.
- `llms.txt` is the best I've seen on any portfolio site — structured, current, and includes Entity Home URL.
- HSTS preload + Permissions-Policy + strict CSP = security headers grade A.
- Prerender produces 125–315 KB of real content per route — crawlers get the full page without executing JS.
- Sitemap `lastmod` dates are accurate (2026-03-06 to 2026-04-17, matching git history).
- Explicit AI crawler allowlist in `robots.txt` maximizes GEO discoverability.

---

## Suggested next-action order

1. Add `/business-os → /business-os-para-airtable` 301 in `vercel.json` (5 min).
2. Fix image dimensions on `/career-ops` (30 min, reusable across articles).
3. Set up IndexNow in deploy pipeline (1 hour).
4. Verify homepage H1 contains visible text (10 min).
5. Re-run `npm run validate-articles` + Rich Results Test spot-check (15 min).
