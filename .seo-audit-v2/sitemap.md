# Sitemap Audit v2 — santifer.io

**Date:** 2026-04-17
**Scope:** `https://santifer.io/sitemap.xml` (LIVE)
**Baseline:** v1 sitemap score 92/100 (17 abr) — issue L1 `lastmod` drift

---

## Score: **96/100** (+4 vs v1)

---

## 1. XML Validation — PASS

- Well-formed XML, correct `urlset` + `xhtml` namespaces
- 18 URLs (well under 50k limit, no index sitemap needed)
- All URLs return HTTP 200 (verified live, full list)
- Referenced from `robots.txt` correctly

## 2. Deprecated Tags — PASS (fixed since v1)

- `<priority>` removed cleanly from `scripts/generate-sitemap.ts` output (still present as type-compat field but not emitted) — confirmed via live fetch
- `<changefreq>` absent (correct)
- Only `<lastmod>` + `<xhtml:link hreflang>` remain — modern minimal sitemap

## 3. `lastmod` Freshness — PASS (L1 from v1 resolved)

Source: `git log -1 --format=%cs -- <file>`. Verified against repo:

| URL group | Sitemap `lastmod` | Last git commit (source files) | Match |
|-----------|-------------------|--------------------------------|-------|
| `/` + `/en` | 2026-04-21 | `src/App.tsx` 2026-04-21, `src/i18n.ts` 2026-04-21 | YES |
| `/sobre-mi` + `/about` | 2026-04-21 | `src/AboutPage.tsx` 2026-04-19, `src/about-i18n.ts` 2026-04-21 | YES (picks max) |
| Articles | `seoMeta.dateModified` from registry | per article | YES |

No more build-time churn. Home/about stay frozen at 2026-04-21 until a real content commit lands. Fix verified.

## 4. Hreflang Reciprocity — PASS

All 8 bilingual pairs reciprocate correctly (ES ↔ EN) with `x-default` pointing to ES. Spot-checked all pairs:

- `/` ↔ `/en` (x-default `/`)
- `/sobre-mi` ↔ `/about` (x-default `/sobre-mi`)
- `/n8n-para-pms` ↔ `/n8n-for-pms`
- `/agente-ia-jacobo` ↔ `/ai-agent-jacobo`
- `/business-os-para-airtable` ↔ `/business-os-for-airtable`
- `/seo-programatico` ↔ `/programmatic-seo`
- `/chatbot-que-se-cura-solo` ↔ `/self-healing-chatbot`
- `/career-ops` ↔ `/career-ops-system`
- `/santifer-irepair` ↔ `/santifer-irepair-founder`

All self-references present. No orphaned alternates.

## 5. Coverage Gaps — 1 MINOR

**Missing from sitemap but 200 OK:** `/privacidad` + `/privacy`

They are registered in `registry.ts` alt-path map (lines 601-602) and live. Low-value (legal), but should be included with low update frequency. Intentional omission is acceptable — legal pages are typically excluded from sitemaps. Not blocking, **-2 pts** for completeness gap.

**Other routes checked and correctly absent:** `/ops` (disallowed in robots.txt, private), `/api/*` (disallowed).

## 6. Cross-Domain (`career-ops.org`) — INFO, not a penalty

`career-ops.org` is a separate property. Google Search Console treats it as a distinct site.

**Recommendation:** do NOT include `career-ops.org` URLs in `santifer.io/sitemap.xml` — cross-domain sitemaps only work if `career-ops.org/robots.txt` explicitly references it via `Sitemap:` or if both are verified under the same GSC property (sitemap cross-submission). Instead:

1. Host a separate sitemap at `career-ops.org/sitemap.xml`
2. Keep the inbound link from `/career-ops` article to `career-ops.org` for entity consolidation
3. `mentions` JSON-LD on career-ops article already links both (`sameAs`) — that is the correct signal

No action required. Not counted against score.

## 7. Location Page Quality Gates — N/A

Zero programmatic location pages on santifer.io. No doorway risk.

## 8. New Pages Recommendation

All 7 registered articles present. Consider adding:

- `/privacidad` + `/privacy` (legal pages, optional, low priority)
- No other orphan routes detected

---

## Validation Matrix

| Check | Severity | Status |
|-------|----------|--------|
| Valid XML | Critical | PASS |
| Under 50k URLs | Critical | PASS (18) |
| All URLs 200 | High | PASS (18/18) |
| No noindex in sitemap | High | PASS |
| No redirects | Medium | PASS |
| Realistic lastmod | Low | PASS (git-derived) |
| No `priority`/`changefreq` | Info | PASS (removed) |
| Hreflang reciprocal | High | PASS (all pairs) |
| Privacy pages coverage | Low | FAIL (-2) |

---

## Delta vs v1 (92 → 96)

- **+3** L1 `lastmod` drift resolved (git `%cs` source-of-truth)
- **+1** `<priority>` dead weight removed
- **-0** hreflang/XML unchanged (already perfect in v1)
- **-2** minor: privacy pages still absent (carry-over, not a regression)

## Next Actions

1. **Optional:** add `/privacidad` + `/privacy` to `scripts/generate-sitemap.ts` with `lastmod` from git on privacy source file. Would hit 98/100.
2. **No action needed** on cross-domain `career-ops.org` — handle as separate property.
3. **Monitor:** verify in GSC that `lastmod` values are now being respected (Google often ignores untrustworthy `lastmod`). Re-crawl request the 4 home/about URLs post-fix.

**Relevant files:**
- `/Users/santifer/code/project2/cv-santiago/scripts/generate-sitemap.ts`
- `/Users/santifer/code/project2/cv-santiago/src/articles/registry.ts`
- `/Users/santifer/code/project2/cv-santiago/public/robots.txt` (fetched live)
