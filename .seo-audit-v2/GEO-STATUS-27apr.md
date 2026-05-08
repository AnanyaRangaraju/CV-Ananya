# GEO Status — 27 abr 2026

**Top-line:** **95/100** (+1 vs 94 baseline) — AI Crawler Access perfect, manifesto well-propagated, stats coherent across 5/6 stat-bearing pages, but two pending items (FAQ SSR on /about, stale "35K+ / 5K+" tile on /career-ops ES) cap further gains.

| Platform        | v2 (22-Apr) | v3 (27-Apr) | Δ   |
|-----------------|-------------|-------------|-----|
| Claude          | 96          | **97**      | +1  |
| ChatGPT         | 95          | **96**      | +1  |
| OAI-SearchBot   | n/a         | **96**      | new |
| Perplexity      | 93          | **94**      | +1  |
| Google AIO      | 92          | **92**      | 0   |
| Bing Copilot    | 91          | **92**      | +1  |

## Confirmed wins since v2

1. **Stats sweep is now coherent.** No occurrences of stale 37.6K, 36.2K, 7.1K, 7.6K, or "2,000+ Discord" in any of `/`, `/en`, `/sobre-mi`, `/about`, `/career-ops`, `/career-ops-system`. 40.1K appears 5× on /sobre-mi (universal sweep working), 9× on /career-ops, 2× on home. 2,100+ Discord rendered SSR on /about.
2. **llms.txt is clean and current.** Manifesto on top, 40.1K+/8.3K+/2,100+ all aligned, 3 entry points to career-ops (landing, case-study, GitHub), 14 sameAs profiles including Wikidata Q138710224.
3. **Manifesto entity-phrase propagated to 5 surfaces** (server-side rendered, not just useEffect): `/sobre-mi`, `/about`, `/career-ops`, `/career-ops-system`, `/llms.txt`.
4. **LCP preload swap shipped on 5/6 articles.** `fetchpriority="high"` confirmed on jacobo, programmatic-seo, n8n-for-pms, self-healing-chatbot, career-ops EN+ES (2 each on the multi-img pages). Only `/business-os-for-airtable` still at 1 (pending).
5. **Wikidata triangulation strong.** `/about` JSON-LD links 14 sameAs profiles (LinkedIn, GitHub, X, dev.to, Substack, ContentDigest, YouTube, StackOverflow, ORCID, Crunchbase, HuggingFace, Wikidata Q138710224, Diario de Sevilla NewsArticle, Zinkee worksFor). Home references three Wikidata Q-IDs (Santiago, Marily Nika, business entity).
6. **AI crawler access perfect.** robots.txt explicitly Allows GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, OAI-SearchBot, Google-Extended. Implicit `User-agent: *` Allow covers anthropic-ai/CCBot. Sitemap declared. IndexNow key live.

## Citability spot-checks

- **About bio paragraph (`/about`):** 138 words — **in optimal 134-167 range.** Self-contained, strong specificity (40.1K+ stars, 71 evals, 6-layer defense, 12 Airtable bases, 2,100 fields, Marily Nika at Google). Cite-ready. **Score 95/100.**
- **"What Happened Next?" (`/career-ops-system`):** 100 words — slightly short of optimal. Strong question-format H3, named entities (France/China/Korea, Discord). **Score 88/100** — would benefit from 30-40 more words covering the open-source mechanics (MIT license + viral mechanics).
- **Manifesto block:** 14-word standalone phrase + 138-word bio context. Perfect for AI extraction; high entity density. **Score 96/100.**

## Top 3 quick wins to push to 96+

### W1 — Fix stale "35K+ / 5K+" tile on /career-ops ES (15 min, +1 to AIO/Perplexity)
**File:** `src/career-ops-i18n.ts` lines 191, 199, 500, 508 — replace `35K+` → `40.1K+`, `5K+ Forks` → `8.3K+ Forks`. The visible `<p>` paragraph already says 40.1K+/8.3K+ but the `MetricsGrid` tiles still show stale values. This regression contradicts the otherwise coherent sweep and is the clearest "low-hanging fruit." Add to the build-time stats sweep so it cannot drift again.

### W2 — Render FAQ HTML + JSON-LD server-side on /about + /sobre-mi (45 min, +2 Google AIO)
**File:** `src/AboutPage.tsx` lines 135-147 — FAQ JSON-LD is injected via `useEffect` and never lands in prerendered HTML. Confirmed: `grep '"FAQPage"'` returns 0 on both /about and /sobre-mi (vs 1 on /career-ops, /home). Move JSON-LD to a server-rendered `<script>` tag (same pattern as career-ops registry) AND render visible `<h2>FAQ</h2>` + `<details>/<summary>` blocks in the JSX so both Google AIO and Bing Copilot can extract Q&A passages directly. This is item M1 in the v2 backlog.

### W3 — Add manifesto to home hero (ES + EN) as quoted entity-phrase block (30 min, +1 Claude/ChatGPT)
**File:** likely `src/App.tsx` and `src/i18n.ts`. The manifesto is currently absent from `/` and `/en` (HTML grep returns 0 even with looser patterns). Adding it as a `<blockquote>` in the hero would (a) extend propagation from 5 → 7 surfaces, (b) capture the highest-traffic page for AI training crawls, (c) reinforce the entity-phrase anchor that drives author attribution in AI answers. Consistency with llms.txt where it's the lead block.

## New regressions found

- **R1 (medium):** `/career-ops` ES MetricsGrid still hardcodes `35K+` and `5K+ Forks` despite the visible paragraph saying 40.1K+/8.3K+ — same page contradicts itself. Build-time sweep didn't reach this file. **Fix in W1.**
- **R2 (low):** Sitemap `lastmod` for n8n-for-pms (2026-03-06), business-os (2026-03-06), seo-programatico (2026-03-10), agente-ia-jacobo (2026-03-07) is still static and pre-dates today's stats sweep commits — git-derived lastmod still pending (M2 in v2 backlog).
- **R3 (low):** jobTitle drift confirmed — home/about render `["Applied AI Operator", "Head of Applied AI", "AI Product Manager", "Solutions Architect", "AI Forward Deployed Engineer"]` (array, 5 roles) while `/career-ops` and `/ai-agent-jacobo` still emit scalar `"Head of Applied AI"`. Inconsistent Person entity for crawlers that dedupe by `@id`. Pending H1 in v2 backlog.
- **R4 (informational):** Testimonials AU, M'Baku, ltrem, mehtab_riaz still not on-page (0 hits across all sampled URLs). H3 in v2 backlog confirmed pending.

## Files referenced

- `/Users/santifer/code/project2/cv-santiago/src/career-ops-i18n.ts` (W1)
- `/Users/santifer/code/project2/cv-santiago/src/AboutPage.tsx` (W2, lines 135-147)
- `/Users/santifer/code/project2/cv-santiago/src/about-i18n.ts` (W2 content)
- `/Users/santifer/code/project2/cv-santiago/src/App.tsx` + `/Users/santifer/code/project2/cv-santiago/src/i18n.ts` (W3)
- `/Users/santifer/code/project2/cv-santiago/public/llms.txt` (canonical reference, OK)
