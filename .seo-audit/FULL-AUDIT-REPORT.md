# Full SEO Audit — santifer.io

**Audit date:** 2026-04-17
**Business type:** Personal portfolio / Entity Home (Head of Applied AI, viral OSS creator)
**Pages audited:** 18 (9 bilingual pairs)

---

## SEO Health Score: **87 / 100** (A)

| Category | Weight | Score | Weighted |
|----------|-------:|------:|---------:|
| Technical SEO | 25% | 92 | 23.0 |
| Content Quality | 25% | 84 | 21.0 |
| On-Page SEO | 20% | 88 | 17.6 |
| Schema / Structured Data | 10% | 92 | 9.2 |
| Performance (CWV) | 10% | 82 | 8.2 |
| Images | 5% | 70 | 3.5 |
| AI Search Readiness | 5% | 88 | 4.4 |
| **Total** | **100%** | | **86.9 → 87** |

Per-subagent scores: Technical 92 · Content 84 · Schema 92 · Sitemap 92 · GEO 88 · Performance 82.

---

## Executive Summary

### Top 5 critical issues

1. **`/business-os` returns 404** — listed in docs/CLAUDE.md but real slug is `/business-os-para-airtable`. Broken inbound links possible.
2. **CLS 0.15–0.30 on `/career-ops`** — `DiagramZoom` images without `width`/`height` cause 700 px layout jumps (Google CWV fail).
3. **LCP preload mismatch on case-study pages** — prerender preloads the 6 KB nav avatar; real LCP is the 132 KB hero image. Wastes the high-priority slot (400–800 ms LCP penalty on mobile).
4. **12 FAQ answers under 100 words** — worst cases `n8n-for-pms EN (22w)` and `career-ops EN (27w)`. Hurts AI citation (Perplexity/ChatGPT prefer ≥80–120 w self-contained answers).
5. **Manifesto phrase not in `llms.txt`** — the signature "Companies use AI to filter candidates. I just gave candidates AI to choose companies." is on 4 pages but absent from the one file LLMs load on first context. Entity-phrase anchor leak.

### Top 5 quick wins

1. Add manifesto to `llms.txt` as `## Manifesto` blockquote (5 min, HIGH impact for GEO).
2. Expand career-ops EN FAQ answers to 100–140 words (30 min, HIGH for AI citation).
3. Add 301 redirect `/business-os` → `/business-os-para-airtable` in `vercel.json` (2 min).
4. Make `width`/`height` required on `DiagramZoom` interface + fix 12 callers (30 min, fixes CLS).
5. Swap per-page preload in `scripts/prerender.tsx` to match article hero image (15 min, 400–800 ms LCP gain).

---

## Technical SEO — 92/100

✅ **Excellent baseline.**
- HSTS preload + strict CSP + Permissions-Policy (security grade A).
- Bilingual hreflang: 9/9 pairs symmetric, zero asymmetry.
- Every AI crawler allowlisted (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot).
- Prerender works — crawlers see full HTML without JS (125–315 KB per route).
- 308 redirects http→https, www→apex, trailing slash; 404 returns proper status + noindex.
- Edge cache HIT on Vercel.

⚠️ **Issues:**
- **[High]** `/business-os` 404 — redirect missing.
- **[Medium]** CLS risk from 7/11 `/career-ops` images without dimensions.
- **[Medium]** IndexNow not configured (env var `INDEXNOW_ENABLED` not set).
- **[Low]** Home H1 extracts as empty text (likely gradient/image-rendered).
- **[Low]** CSP uses `'unsafe-inline'` for script/style (acceptable with Vite).

---

## Content Quality — 84/100

✅ **Experience 92 · Expertise 88 · Trust 85.**
- Deep case studies (jacobo 10,877 w / 16 H2 / 31 H3; pSEO 8,352 w).
- First-person voice with concrete lived metrics.
- No thin content, no AI-spam red flags.
- Manifesto properly contextualized on career-ops (39% offset, after hero) and /about (58%, bridges header→bio).

⚠️ **Authoritativeness 74** — flagship pages under-cite:
- `/career-ops` only 5 external domains.
- `/chatbot-que-se-cura-solo` only 3.
- `/business-os-para-airtable` and `/seo-programatico` only 1–2 citations each (most at risk of being paraphrased without attribution).

⚠️ **12 FAQ answers <100 words.** Ordered by severity:
`n8n-for-pms EN 22w · career-ops EN 27w · self-healing-chatbot ES/EN 28w · career-ops ES 31w · jacobo EN 43w · programmatic-seo EN 45w · business-os EN 47w · n8n-for-pms ES 47w · jacobo ES 50w · business-os ES 50w · programmatic-seo ES 54w`.

⚠️ No human-visible "Last updated" line — dates only in JSON-LD.

---

## Schema / Structured Data — 92/100

✅ **All 15 pages parse cleanly. Zero required-property violations.**
- Person `sameAs` perfectly consistent across 13 pages (16 URLs each, including Wikidata Q138710224).
- career-ops: TechArticle + SoftwareSourceCode (MIT + offers $0 + Wikidata Q139007988 + Discord discussionUrl) + 9 citations.
- /about: 9 distinct `@type`s (ProfilePage, Person, SoftwareApplication, NewsArticle, NewsMediaOrganization, EducationalOrganization, EducationalOccupationalCredential, Organization, PostalAddress).
- All `dateModified` now YYYY-MM-DD (just fixed in ship-it).

⚠️ **Missing high-value additions:**
- **[Medium]** Top-level `Organization` on home/about (Santifer iRepair only appears nested in `founder`). Unlocks Knowledge Panel eligibility.
- **[Medium]** Top-level `SoftwareApplication` on career-ops (sibling to TechArticle). Opens a second rich-result lane.
- **[Medium]** `FAQPage` schema on /about + /sobre-mi (visible FAQs exist but no JSON-LD). Google AIO + Perplexity weight FAQPage ~2× plain text.

---

## Sitemap — 92/100

✅ **18 URLs, all HTTP 200. Hreflang reciprocal. Robots declares sitemap.**
- GSC submission confirmed (204 OK).
- Canonical = `<loc>` spot-checked clean.
- Registry single source of truth.

⚠️ **Issues:**
- **[Low]** `lastmod` drift on home + about (4 URLs) — `new Date()` each build, dilutes recrawl signal. Fix: derive from git `%cs` of source component.
- **[Info]** `<priority>` ignored by Google since 2017 — dead weight.

---

## Performance (CWV) — 82/100

| Metric | Home | /about | /career-ops |
|--------|-----:|-------:|------------:|
| LCP | ~2.0 s ✅ | ~2.1 s ✅ | **~3.1 s ⚠️** |
| INP | ~150 ms ✅ | ~150 ms ✅ | ~150 ms ✅ |
| CLS | <0.05 ✅ | <0.05 ✅ | **0.15–0.30 ⚠️** |
| TTFB | 103 ms ✅ | 125 ms ✅ | 101 ms ✅ |

✅ **Strengths:** Brotli on everything, self-hosted fonts + preload + `font-display: swap`, critical CSS inlined, route-level `React.lazy()`, zero 3rd-party JS on critical path, immutable caching.

⚠️ **Issues:**
- **[High]** Wrong LCP preload on article pages (avatar vs hero).
- **[High]** `DiagramZoom` CLS — 12 callers missing dimensions (7 in CareerOps, 3 in SelfHealingChatbot, 2 in N8nForPMs). Template: `JacoboAgent.tsx` is 25/25 clean.
- **[Low]** GridSnakes canvas animation runs even when off-screen/tab-hidden (battery + INP minor).
- **[Low]** Inlined critical CSS is 36 KB (target <14 KB — Critters including full Tailwind theme).
- **[Low]** DM Sans 62 KB — subset to used weights.

---

## Images — 70/100

⚠️ **Main drag on overall score.**
- 1 image without alt text on `/career-ops`.
- 7 images without width/height on `/career-ops` (CLS).
- Total 12 `DiagramZoom` callers missing dimensions across 3 articles.
- 22 images without dimensions on `/programmatic-seo`.

Fix: make `width`/`height` REQUIRED on `DiagramZoom` interface (TypeScript will flag all callers). Template exists.

---

## AI Search Readiness (GEO) — 88/100

| Platform | Score |
|----------|------:|
| Google AI Overviews | 90 |
| ChatGPT / OAI-SearchBot | 92 |
| Claude | 92 |
| Perplexity | 88 |
| Bing Copilot | 85 |

✅ **Strengths:**
- Signature phrase anchor: 1 occurrence in each of 4 target pages (4/4 on target).
- Wikidata + Crunchbase + ORCID + 16 sameAs URLs on Person.
- llms.txt 239 lines, 200 OK as GPTBot, rich structure.
- Bing WMT verified.
- FAQPage schema on `/career-ops`.

⚠️ **Gaps (in priority order):**
1. Manifesto NOT in llms.txt — biggest entity-phrase leak.
2. Career-ops traction (35.6K stars, 1.3K Discord, 2.6K upvotes) needs a self-contained 134–167 word passage in llms.txt for quotable chunks.
3. FAQPage schema missing on /about + /sobre-mi.
4. Career-ops + chatbot need visible "Last updated: YYYY-MM-DD" below H1.

---

## Detailed findings per subagent

- `.seo-audit/technical.md` — full technical breakdown
- `.seo-audit/content.md` — E-E-A-T per page + FAQ length table
- `.seo-audit/schema.md` — JSON-LD snippets + coverage gaps
- `.seo-audit/sitemap.md` — per-URL validation
- `.seo-audit/geo.md` — platform-by-platform scoring
- `.seo-audit/performance.md` — CWV per page + bundle analysis

See `.seo-audit/ACTION-PLAN.md` for prioritized fix list.
