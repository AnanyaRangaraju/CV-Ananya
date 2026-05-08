# Schema.org JSON-LD Audit v2 — santifer.io (LIVE)

**Date:** 2026-04-17  **Score:** 94 / 100 (+2 vs v1 baseline 92)
**Verdict:** Major wins deployed correctly. Three consistency leaks prevent a higher score.

## 1 · What's working (confirmed LIVE)

| Item | Status |
|---|---|
| Home `@graph`: WebSite + ProfilePage + Organization + SoftwareSourceCode + Person + FAQPage (20 Qs) | ✅ on `/` and `/en` |
| Top-level Organization `Santifer iRepair` `@id=https://santiferirepair.es/#org` | ✅ LIVE |
| Person `founder` → `{@id: ...iRepair/#org}` reference (no nested duplicate) | ✅ LIVE |
| SoftwareSourceCode split: `url=career-ops.org`, `codeRepository=github.com/santifer/career-ops`, `sameAs=[career-ops.org, github, Wikidata Q139007988]` | ✅ LIVE on home **and** in every article's `mentions[]` |
| Person `sameAs` = **16 entries**, identical order on all 11 crawled pages | ✅ 100% consistent |
| Person `worksFor` Zinkee Organization with `@id=https://zinkee.com/#org` | ✅ on `/` and `/en` only |
| Person `award` "AI Product Academy Bootcamp — Winning Project 2025" | ✅ on `/` and `/en` only |
| All `dateModified` ISO 8601 (YYYY-MM-DD) | ✅ |
| `@context = https://schema.org` (HTTPS) | ✅ all pages |
| All URLs absolute | ✅ |
| FAQPage in SSR for 6 articles + home (20/10/9/8/7/7/6) | ✅ |

## 2 · Critical inconsistencies (the -6 points)

### 2.1 ❌ `jobTitle` drift across pages — **blocks Person entity consolidation**

| Page | jobTitle[0] | Source |
|---|---|---|
| `/`, `/en` | `Applied AI Operator` (5-item array) | ✅ updated |
| `/about`, `/sobre-mi` | `Head of Applied AI` (4-item array) | ❌ AboutPage.tsx:63 |
| All 6 articles | `Head of Applied AI` (**string, not array**) | ❌ `src/articles/json-ld.ts:49` |

Same `@id=https://santifer.io/#person` is declared with **three different jobTitle shapes**. Search engines building a knowledge graph from `sameAs` reconciliation will see conflicting occupation claims. Also the article Person uses a scalar string instead of an array — shape mismatch with the canonical home declaration.

**Fix:** Sync `src/articles/json-ld.ts:49` and `src/AboutPage.tsx:63` to the home array starting with `"Applied AI Operator"`.

### 2.2 ❌ FAQPage on `/about` + `/sobre-mi` is **client-side only**

`AboutPage.tsx:136` injects the FAQPage script via `useEffect` → `document.head.appendChild`. SSR HTML contains **0 `FAQPage` tokens, 0 question strings**. Googlebot executes JS and will likely pick it up, but:
- Conservative LLM crawlers (Perplexity, Common Crawl, ChatGPT browse) often don't execute JS → GEO signal lost.
- First-paint structured-data parsers (Facebook debugger, LinkedIn Post Inspector, Slack unfurl) will miss it.

**Fix:** Either prerender the FAQ JSON-LD during build (same pattern as articles) or inject server-side in `index.html` / Vercel edge.

### 2.3 ⚠️ Articles' nested `Person` is a **thin duplicate**, missing `award`, `worksFor`, `hasOccupation`

All 6 articles declare a `Person` node in the `@graph` with only: `name`, `url`, `image`, `sameAs` (16), `jobTitle` (string). The home's richer Person (award, worksFor, hasOccupation, hasCredential, alumniOf) is not available when Google crawls an article cold. Since they share `@id`, graph reconciliation is theoretically fine, but it's fragile.

**Fix:** Option A (cheap) — add `"mainEntityOfPage": "https://santifer.io/#person"` to article Person nodes to make consolidation explicit. Option B (clean) — replace nested Person with a `{@id: ...}` reference only, since the richer version lives on home.

## 3 · Quotation / blockquote cite

```html
<blockquote cite="https://santifer.io/career-ops" ...>
```

This is **HTML5 semantic only** — browsers do not render it and Google does **not** promote it to rich results. To get structured Quotation markup, you'd need an explicit `"@type": "Quotation"` node referencing `creator` and `text`. Current cite attribute is harmless but delivers zero SEO uplift.

**Recommendation:** Skip it (Quotation is not a Google rich-result type). Leave cite attribute for a11y semantics only.

## 4 · No regressions from v1

- BreadcrumbList, WebSite, TechArticle, Person `@id` cross-refs all valid.
- SoftwareSourceCode split is textbook — clean signal for career-ops.org as distinct web entity from its GitHub repo.
- Wikidata linking (Q138710224 Person, Q139007988 career-ops) unchanged and consistent.

## 5 · New coverage gaps

1. **CreativeWork/Blog** for home: a `Blog` or `CollectionPage` listing articles would improve topical clustering.
2. **VideoObject** on `/agente-ia-jacobo` and `/seo-programatico` if demos embedded (check for video elements).
3. **Article lastReviewed** field on TechArticle for evergreen content signal.

## 6 · Priority fixes (ranked)

| # | Priority | Effort | Delta |
|---|---|---|---|
| 1 | CRITICAL | 1 line each in 2 files | **+3** jobTitle sync (`src/articles/json-ld.ts:49` → array starting with "Applied AI Operator"; `src/AboutPage.tsx:63` → same 5-item array) |
| 2 | HIGH | Prerender script | **+2** Move /about FAQPage from useEffect to SSR |
| 3 | MEDIUM | Add `@id` ref or mainEntityOfPage | **+1** Tighten article Person → home Person linkage |

Apply #1 alone → **97/100**. All three → **100/100**.

## Files to edit

- `/Users/santifer/code/project2/cv-santiago/src/articles/json-ld.ts` (line 49)
- `/Users/santifer/code/project2/cv-santiago/src/AboutPage.tsx` (line 63, line 136 hydration)
