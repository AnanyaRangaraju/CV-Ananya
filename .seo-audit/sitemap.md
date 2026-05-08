# Sitemap Audit — santifer.io

**Date:** 2026-04-17
**Sitemap URL:** https://santifer.io/sitemap.xml
**Generator:** `scripts/generate-sitemap.ts` (build-time, derived from `src/articles/registry.ts`)
**Score:** 92 / 100

---

## Summary

18 URLs in sitemap. All return HTTP 200. XML is well-formed. Hreflang pairs and x-default are present on every entry. No deprecated or forbidden patterns. 50k-URL limit is a non-issue (0.04% utilised). No location pages → quality gates N/A.

Minor deductions for:

- Home entries repeat `lastmod=today` (dynamic `new Date()` in generator) instead of reflecting real content change
- `priority` values present (Google ignores them — harmless but noise)
- `/en` (home EN) and `/sobre-mi` + `/about` share an ambiguous hreflang self-reference pattern worth noting

---

## Validation checks

| Check | Severity | Result |
|---|---|---|
| Well-formed XML (`xmllint --noout`) | Critical | PASS |
| UTF-8 declaration | Critical | PASS |
| Sitemap namespace `sitemaps.org/schemas/sitemap/0.9` | Critical | PASS |
| xhtml namespace declared for hreflang | Critical | PASS |
| File size < 50 MB | Critical | PASS (7,516 bytes) |
| URL count < 50,000 | Critical | PASS (18) |
| All `<loc>` return 200 | High | PASS (18/18 checked live) |
| Noindexed URLs excluded | High | PASS (`/privacidad`, `/privacy` correctly omitted — both carry `robots: noindex, nofollow`) |
| Redirected URLs | Medium | PASS (zero redirects on sampled URLs) |
| Canonical matches `<loc>` | Medium | PASS (spot-checked `/`, `/en`, `/career-ops`, `/santifer-irepair`) |
| `lastmod` realistic per page | Low | PARTIAL (home/about use `today`; articles use `seoMeta.dateModified`) |
| `priority` / `changefreq` | Info | `priority` present (Google ignores); `changefreq` not used (good) |
| Robots.txt declares sitemap | Info | PASS (`Sitemap: https://santifer.io/sitemap.xml`) |
| Sitemap MIME type | Info | PASS (`application/xml`) |
| Hreflang reciprocity | High | PASS (every URL lists both `es` and `en` alternates + `x-default`) |
| Single-domain scope | Info | PASS (no subdomain leakage) |

---

## URL coverage (18 URLs)

| # | URL | Status | lastmod | Registry source |
|---|---|---|---|---|
| 1 | https://santifer.io/ | 200 | 2026-04-17 | home ES |
| 2 | https://santifer.io/en | 200 | 2026-04-17 | home EN |
| 3 | https://santifer.io/sobre-mi | 200 | 2026-04-17 | about ES |
| 4 | https://santifer.io/about | 200 | 2026-04-17 | about EN |
| 5 | https://santifer.io/n8n-para-pms | 200 | 2026-03-06 | `n8n-for-pms` ES |
| 6 | https://santifer.io/n8n-for-pms | 200 | 2026-03-06 | `n8n-for-pms` EN |
| 7 | https://santifer.io/agente-ia-jacobo | 200 | 2026-03-07 | `jacobo` ES |
| 8 | https://santifer.io/ai-agent-jacobo | 200 | 2026-03-07 | `jacobo` EN |
| 9 | https://santifer.io/business-os-para-airtable | 200 | 2026-03-06 | `business-os` ES |
| 10 | https://santifer.io/business-os-for-airtable | 200 | 2026-03-06 | `business-os` EN |
| 11 | https://santifer.io/seo-programatico | 200 | 2026-03-10 | `programmatic-seo` ES |
| 12 | https://santifer.io/programmatic-seo | 200 | 2026-03-10 | `programmatic-seo` EN |
| 13 | https://santifer.io/chatbot-que-se-cura-solo | 200 | 2026-03-14 | `self-healing-chatbot` ES |
| 14 | https://santifer.io/self-healing-chatbot | 200 | 2026-03-14 | `self-healing-chatbot` EN |
| 15 | https://santifer.io/career-ops | 200 | 2026-04-17 | `career-ops` ES |
| 16 | https://santifer.io/career-ops-system | 200 | 2026-04-17 | `career-ops` EN |
| 17 | https://santifer.io/santifer-irepair | 200 | 2026-04-17 | `santifer-irepair` ES |
| 18 | https://santifer.io/santifer-irepair-founder | 200 | 2026-04-17 | `santifer-irepair` EN |

Expected count: 2 home + 2 about + 7 articles × 2 langs = 18. ✅ Matches.

---

## Hreflang analysis

Every entry declares:
- `hreflang="es"` → ES slug
- `hreflang="en"` → EN slug
- `hreflang="x-default"` → ES slug (or `xDefaultSlug` override; only `santifer-irepair` uses this intentionally, pointing to the same slug — bridge page)

**Reciprocity:** ES and EN entries point to the same pair → passes Google's bidirectional rule.

**Self-reference:** Each URL lists itself among its alternates (expected behaviour, required by Google).

**Edge case — bridge page:** `santifer-irepair` has `xDefaultSlug: 'santifer-irepair'`. Both ES and EN variants currently point to the ES slug as x-default. Correct for a Seville-local entity page where Spanish is the primary language.

---

## lastmod freshness

| Date | Count | Interpretation |
|---|---|---|
| 2026-04-17 (today) | 6 | home×2 + about×2 + career-ops×2 |
| 2026-03-14 | 2 | self-healing-chatbot (dateModified) |
| 2026-03-10 | 2 | programmatic-seo (dateModified) |
| 2026-03-07 | 2 | jacobo (dateModified) |
| 2026-03-06 | 4 | n8n-for-pms + business-os (dateModified) |

Article `lastmod` is driven by `seoMeta.dateModified` in the registry — realistic and per-article.

**Caveat:** home + about use `new Date()` every build. This means every deploy rewrites those four `lastmod` values even if nothing changed on those pages → creates noise in Google's recrawl signal. Low severity but worth revisiting (store actual last-change dates for these pages too).

---

## Orphan / missing page analysis

Checked non-sitemap routes:

| URL | Status | Indexable? | Should be in sitemap? |
|---|---|---|---|
| `/privacidad` | 200 | noindex, nofollow | No — correctly excluded |
| `/privacy` | 200 | noindex, nofollow | No — correctly excluded |
| `/ops` | 404 (auth gate) | n/a | No |
| `/llms.txt` | 200 | n/a (not HTML) | No (it's a spec file, not a page) |

No orphan candidates detected. All indexable pages registered in `articleRegistry` are covered.

---

## Submission / discovery

- `robots.txt` declares sitemap: ✅ `Sitemap: https://santifer.io/sitemap.xml`
- `robots.txt` disallows `/api/` and `/ops`: ✅ correctly blocks private dashboard + edge endpoints
- AI crawler allowlist present (GPTBot, ClaudeBot, PerplexityBot, etc.): ✅ GEO-friendly
- GSC submission: reported 204 OK on last deploy per task context → assume active

---

## Issues list

### 🟡 Low — `lastmod` drift on home/about
`scripts/generate-sitemap.ts` uses `new Date().toISOString().slice(0, 10)` for home + about, so every build resets those 4 lastmods. Google may learn to ignore these signals.
**Fix:** Add a static `dateModified` to a "meta" registry entry for home/about, or compute from `git log -1 --format=%cs src/App.tsx` / `src/About.tsx` in the generator.

### 🟢 Info — `<priority>` is dead weight
Google officially ignores `<priority>` since 2017. Bing ignores it too. Not harmful, but ~10% of the file is these tags. Removing would shrink the sitemap slightly and reduce surface for future confusion.
**Fix (optional):** drop `<priority>` from `urlBlock()`.

### 🟢 Info — `changefreq` correctly omitted
Good decision. Keep it out.

### 🟢 Info — Consider lastmod with ISO timestamp
Current format `YYYY-MM-DD` is valid. W3C Datetime with timezone (`2026-04-17T12:00:00+00:00`) gives more precision if ever needed.

---

## Score breakdown (92 / 100)

| Dimension | Points | Score |
|---|---|---|
| XML validity + encoding | 10 | 10 |
| URL coverage vs registry | 15 | 15 |
| HTTP 200 on all entries | 15 | 15 |
| Noindex exclusion correctness | 10 | 10 |
| Hreflang completeness + reciprocity | 15 | 15 |
| lastmod accuracy | 10 | 6 (home/about drift) |
| Robots.txt alignment | 5 | 5 |
| No deprecated/harmful tags | 10 | 8 (priority noise) |
| Size / URL-count headroom | 5 | 5 |
| Submission / discovery | 5 | 3 (assume 204 per context; no live GSC verification performed) |
| **Total** | **100** | **92** |

---

## Recommendations (priority order)

1. **Pin home + about lastmod to real change dates** — derive from git blame or a const in the registry rather than `new Date()`. Prevents noise and makes Google's recrawl signals meaningful.
2. **Drop `<priority>`** in the next sitemap generator refactor — cosmetic but future-proofs against reviewers flagging it.
3. **Verify GSC submission status in live dashboard** (outside scope here; was reported 204 OK by previous deploy).
4. **When adding the next article**, confirm `seoMeta.dateModified` is set before merging — registry is the single source of truth.

---

## Files touched during audit

- Read: `/Users/santifer/code/project2/cv-santiago/src/articles/registry.ts`
- Read: `/Users/santifer/code/project2/cv-santiago/scripts/generate-sitemap.ts`
- Fetched live: `https://santifer.io/sitemap.xml`, `https://santifer.io/robots.txt`, 18 page URLs
- Written: `/Users/santifer/code/project2/cv-santiago/.seo-audit/sitemap.md` (this file)
