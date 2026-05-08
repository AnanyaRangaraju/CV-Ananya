# Action Plan — santifer.io SEO Audit

**Health Score: 87/100** — target 95+ after all High-priority fixes.

---

## Critical
*Blocks indexing / causes penalties. Fix immediately.*

**None.** Site is healthy — no Critical issues.

---

## High
*Significant ranking impact. Fix within 1 week.*

### H1. Add 301 redirect `/business-os` → `/business-os-para-airtable`
**Why:** Page listed in CLAUDE.md returns 404. Likely inbound links (LinkedIn, email, past PRs) broken.
**How:** Add to `vercel.json` `redirects[]`:
```json
{ "source": "/business-os", "destination": "/business-os-para-airtable", "statusCode": 301 }
{ "source": "/business-os-for-airtable", "destination": "/business-os", "statusCode": 301 }  // verify if EN short also in use
```
**Effort:** 2 min
**Expected gain:** recover lost backlink equity.

### H2. Fix CLS on `/career-ops` (DiagramZoom dimensions)
**Why:** CLS 0.15–0.30 fails Google CWV threshold (<0.1). 700 px jumps per image load.
**How:**
1. Make `width`/`height` REQUIRED in `DiagramZoom` interface (`src/articles/content-types.tsx:481`).
2. Fix 12 callers: 7 in `CareerOps.tsx:153–285`, 3 in `SelfHealingChatbot.tsx:233–247`, 2 in `N8nForPMs.tsx`.
3. Template: `JacoboAgent.tsx` is 25/25 clean.
4. Add `aspect-ratio` CSS as belt-and-suspenders.
**Effort:** 30 min
**Expected gain:** CLS 0.20 → <0.05. Mobile CWV pass.

### H3. Swap LCP preload per article page
**Why:** Prerender preloads 6 KB nav avatar as high-priority; real LCP is 132 KB hero image. Wasted slot costs 400–800 ms LCP on mobile.
**How:** Modify `scripts/prerender.tsx` — for article routes, detect the `<img fetchpriority="high">` in rendered HTML and swap the `<link rel="preload" as="image">` in `<head>` to point to that URL.
**Effort:** 15 min
**Expected gain:** /career-ops LCP ~3.1 s → ~2.3 s.

### H4. Expand 12 short FAQ answers to 100–140 words
**Why:** AI citation — Perplexity, ChatGPT, Google AIO all prefer self-contained 80–120 w answers. Under 100 w = dropped from rich results + low citation probability.
**How:** Priority order (worst first):
1. `n8n-for-pms` EN (22 w) → 110 w
2. `career-ops` EN (27 w) → 120 w (flagship, highest ROI)
3. `self-healing-chatbot` ES + EN (28 w each) → 110 w each
4. `career-ops` ES (31 w) → 120 w
5. Remaining 7 answers (43–54 w) → 100–120 w
**Effort:** 30 min for career-ops pair, 2 h for all 12
**Tool:** run `/seo content` skill on each article

### H5. Add manifesto to `llms.txt`
**Why:** Signature phrase lives on 4 pages but absent from the file LLMs load on first context. Biggest entity-phrase leak.
**How:** In `public/llms.txt`, add near the top after the entity intro:
```
## Manifesto

> Companies use AI to filter candidates. I just gave candidates AI to choose companies.
```
Plus a self-contained 134–167 word career-ops traction paragraph (see `.seo-audit/geo.md` for draft) with 35.6K stars, 7.1K forks, 631 evaluations, 2,600 upvotes, 1,300 Discord, and the manifesto closing line.
**Effort:** 10 min
**Expected gain:** HIGH — flywheel amplification.

---

## Medium
*Optimization opportunity. Fix within 1 month.*

### M1. Add top-level `Organization` schema on home + /about
**Why:** Santifer iRepair only appears nested in `founder`. Promoting to first-class entity unlocks Knowledge Panel eligibility + strengthens entity graph.
**How:** In `index.html` JSON-LD and AboutPage, add sibling node with logo, foundingDate, areaServed.
**Effort:** 20 min

### M2. Add top-level `SoftwareApplication` on career-ops
**Why:** Currently SoftwareSourceCode lives only in `mentions[]`. career-ops gets indexed only as article, not as software. Adding `SoftwareApplication` opens a second rich-result lane (App Knowledge Panel).
**How:** Add to `buildJsonLd` in `CareerOps.tsx` — sibling of TechArticle with offers $0, softwareVersion, applicationCategory.
**Effort:** 15 min

### M3. Add `FAQPage` schema on /about + /sobre-mi
**Why:** Visible FAQs exist but lack JSON-LD. Google AIO + Perplexity weight FAQPage ~2× plain text.
**How:** In `AboutPage.tsx`, inject a second JSON-LD block with FAQPage schema derived from `t.faq`.
**Effort:** 20 min

### M4. Configure IndexNow
**Why:** Bing/Yandex/Naver recrawl-on-push accelerator missing. Build script exists but `INDEXNOW_ENABLED` flag not set.
**How:**
1. Generate UUID key.
2. Expose at `/public/<key>.txt` (content = key).
3. Set `INDEXNOW_ENABLED=true` and `INDEXNOW_KEY=<key>` in Vercel env vars.
4. Reference in `robots.txt`.
**Effort:** 15 min

### M5. Boost `citation[]` on `/business-os-para-airtable` and `/seo-programatico`
**Why:** Both under-cite (1–2 refs). Biggest risk of being paraphrased by LLMs without attribution.
**How:** Add 3–5 authoritative refs each to registry `seoMeta.citation[]`:
- business-os: Airtable API docs, n8n docs, Anthropic docs, Make.com docs
- programmatic-seo: DataForSEO docs, Google pSEO guidelines, Screaming Frog, Ahrefs
**Effort:** 30 min

### M6. Add visible "Last updated: YYYY-MM-DD" below H1 on case studies
**Why:** Currently only in JSON-LD. Explicit freshness cue for humans AND LLMs.
**How:** Update `ArticleHeader` component in `src/articles/components.tsx` to render lastUpdated next to the date.
**Effort:** 20 min

### M7. Fix empty homepage H1
**Why:** Extraction returned empty text. H1 exists but visually rendered via gradient/image. Crawlers may not attribute intent.
**How:** Verify in `src/App.tsx` — ensure H1 has plain text content even when styled with gradient fill.
**Effort:** 10 min

### M8. Add manifesto as `<blockquote cite>` + schema.org `Quotation`
**Why:** Currently rendered as `<blockquote>` but no `cite` attr, no `Quotation` schema. Adding both makes it explicitly quotable by LLMs.
**How:** Update `<Manifesto>` component in `content-types.tsx` — add `cite="https://santifer.io/career-ops"` attribute and emit inline JSON-LD `Quotation` node.
**Effort:** 15 min

---

## Low
*Nice to have. Backlog.*

### L1. Fix sitemap `lastmod` drift
Home + about use `new Date()` every build. Fix: derive from git `%cs` of `src/App.tsx` / `AboutPage.tsx`.
**Effort:** 15 min

### L2. Remove `<priority>` from sitemap
Ignored by Google since 2017. Shrinks file.
**Effort:** 5 min

### L3. Gate GridSnakes canvas animation to viewport
`setInterval(tick, 180)` in `src/App.tsx:211` runs forever. Wrap with IntersectionObserver + `visibilitychange`.
**Effort:** 15 min — minor INP/battery win.

### L4. Subset DM Sans font (62 KB → ~15 KB)
Include only used weights.
**Effort:** 20 min

### L5. Reduce inlined critical CSS (36 KB → <14 KB)
Critters is including the full Tailwind theme registry. Tune config.
**Effort:** 30 min

### L6. Review Lighthouse on each registry type
Run Rich Results Test + Lighthouse per case study to catch one-offs.
**Effort:** 45 min (one-time audit).

---

## Execution order (recommended)

**Day 1 — quick wins (~2 h total):**
1. H1 (redirect) — 2 min
2. H5 (manifesto in llms.txt) — 10 min
3. H3 (LCP preload swap) — 15 min
4. H4 career-ops EN FAQ — 30 min
5. M4 (IndexNow) — 15 min
6. M7 (empty H1) — 10 min
7. Commit + deploy

**Day 2–3 — CLS fix + schema (~2 h):**
8. H2 (DiagramZoom dimensions + 12 callers) — 30 min
9. M1 (Organization) — 20 min
10. M2 (SoftwareApplication) — 15 min
11. M3 (FAQPage on /about) — 20 min
12. M8 (Manifesto Quotation schema) — 15 min
13. Commit + deploy

**Week 1 — content (~3 h):**
14. H4 remaining 11 FAQ answers — 2 h
15. M5 (citation boost on business-os + pSEO) — 30 min
16. M6 (visible Last updated) — 20 min
17. Commit + deploy

**Backlog (Low priority, optional):**
- L1 – L6 when time permits

---

## Post-implementation target

- SEO Health Score: 87 → **95+**
- Core Web Vitals on `/career-ops`: all green
- AI citation readiness: 88 → **95** (manifesto in llms.txt + FAQ expansion)
- Schema coverage: 92 → **98** (Organization + SoftwareApplication + FAQPage on about)
