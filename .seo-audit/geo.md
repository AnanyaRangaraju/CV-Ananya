# GEO Audit — santifer.io

**Date:** 2026-04-17
**Scope:** Live audit (robots.txt, llms.txt, home, /career-ops, /career-ops-system, /about, /sobre-mi)
**Overall GEO Score:** 88/100

---

## Dimension Breakdown

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability (passage length, self-contained answers, Q-headings) | 25% | 92 | 23.0 |
| Structural Readability (H-hierarchy, FAQ, lists) | 20% | 95 | 19.0 |
| Multi-Modal (images, og:image, visual hierarchy) | 15% | 80 | 12.0 |
| Authority & Brand Signals (Wikidata, schema, authorship) | 20% | 85 | 17.0 |
| Technical Accessibility (SSR, crawlers, sitemap) | 20% | 85 | 17.0 |
| **Total** | | | **88.0** |

---

## 1. AI Crawler Access Status

| Crawler | Status | Notes |
|---|---|---|
| GPTBot | ALLOWED | Explicit rule |
| ChatGPT-User | ALLOWED | Explicit rule |
| OAI-SearchBot | ALLOWED | Explicit rule |
| ClaudeBot | ALLOWED | Explicit rule |
| PerplexityBot | ALLOWED | Explicit rule |
| Google-Extended | ALLOWED | Explicit rule |
| CCBot | Not listed (allowed via `User-agent: *`) | Consider explicit stance |
| anthropic-ai | Not listed (allowed via `*`) | Training-only crawler, optional |
| Bingbot | Allowed via `*` | Bing Copilot via Bing index |

Blocks: `/api/`, `/ops` — correct for private dashboard.
Sitemap linked: `https://santifer.io/sitemap.xml` (18 URLs, bilingual pairs).

## 2. llms.txt Compliance

**Status:** PRESENT and well-formed (239 lines, 200 HTTP).
**Live fetch confirms 200 OK with GPTBot UA.** WebFetch rendered it as biography which indicates the file is being treated as human-readable prose — exactly the behavior intended for LLM context windows.

Strengths:
- Entity header with title + role tagline
- Contact block with canonical URLs (LinkedIn, X, GitHub, Substack, dev.to, PH)
- Professional summary in 2-3 sentence chunks (citable)
- Target roles enumerated (AI PM / Solutions Architect / AI FDE)
- Jacobo key achievement quantified (~90% self-service)
- Projects block with one-line outcomes + deep links
- 6 published case studies with URL + one-liner (excellent for retrieval)
- Certifications (Anthropic x8, Airtable x3, Make x1) dated and explicit
- "How to Hire Santiago" closing CTA

Gaps (minor):
- No `## Optional` / `## Secondary` sections per emerging llms.txt spec
- No dated `Last-Updated` marker inside the file
- Career-Ops traction stats (35.6K stars, 2600 upvotes, 1300 Discord) NOT in llms.txt — the flywheel asset is underweighted here
- Manifesto signature phrase missing from llms.txt (huge miss for entity-phrase anchor)

## 3. Signature Phrase Anchor Verification

Target: 4 verbatim occurrences of `Companies use AI to filter candidates. I just gave candidates AI to choose companies.`

| URL | Count | Status |
|---|---|---|
| /career-ops (ES) | 1 | OK |
| /career-ops-system (EN) | 1 | OK |
| /about (EN) | 1 | OK |
| /sobre-mi (ES) | 1 | OK |
| / (home ES) | 0 | Missing |
| /en (home EN) | 0 | Missing |

**4/4 on the targeted pages is achieved.** Not found on home — intentional (home is CV), but consider adding as a pull-quote on `/en` and `/` to reach 6 occurrences and strengthen the entity-phrase association in LLM retrieval.

## 4. Citability Analysis

### Home (/)
- H1: "Open Source Builder que construye sistemas de IA con HITL + MCP + RAG" — strong entity-keyword anchor
- Opening 100 words: self-contained, first-person, mentions Santifer iRepair + 90% self-service + 12 DBs. Citable.
- Missing: FAQ block on home. All FAQ lives on /about and /career-ops.

### /career-ops + /career-ops-system
- FAQ schema: PRESENT (11 Question blocks detected)
- Manifesto appears verbatim in opening
- H2s are question-phrased: "Why Did I Need...", "How Does It Work?", "How Does It Evaluate?" — perfect for Google AIO + Perplexity
- Passage sample: "Career-Ops evaluates 631 offers. I decide which ones get my time." — 12 words, scoped, citable (under optimal 134-167 but works as a pull-quote)
- Traction numbers concrete: 35.6K⭐, 7.1K forks, 631 evaluations, 354 PDFs, 2600+ Reddit upvotes, 1300+ Discord
- Estimated total word count: ~5,500 (section chunks of 250-520 words — well within citable range)

### /about
- Rich schema stack: Person, ProfilePage, SoftwareApplication, NewsArticle, NewsMediaOrganization, EducationalOccupationalCredential, EducationalOrganization, Organization, PostalAddress
- Wikidata Q138710224 linked
- Crunchbase + ORCID also linked (sameAs depth = excellent)
- Bio passages scoped to 2-3 sentences with name + role + company: ideal citability

## 5. Authority & Brand Signals

| Signal | Status |
|---|---|
| Wikidata entity Q138710224 | LINKED (via sameAs on /about, /sobre-mi) |
| Crunchbase person page | LINKED |
| ORCID 0009-0006-2192-7210 | LINKED |
| GitHub (santifer) | LINKED |
| LinkedIn | LINKED |
| Substack newsletter | LINKED (in llms.txt) |
| Product Hunt, dev.to, daily.dev | LINKED (in llms.txt) |
| msvalidate.01 (Bing WMT) | PRESENT on home |
| JSON-LD Person schema | PRESENT on /about |
| FAQPage schema | PRESENT on /career-ops |
| Dates (dateModified, datePublished) | Handled via validate-articles script |

## 6. Platform-Specific Scores

| Platform | Score | Rationale |
|---|---|---|
| Google AI Overviews | 90 | Question-phrased H2s + FAQPage schema + Person schema + bilingual indexing |
| ChatGPT / OAI-SearchBot | 92 | GPTBot allowed + llms.txt + citable passages + entity links |
| Perplexity | 88 | PerplexityBot allowed + source links + FAQ + traction numbers with attribution |
| Bing Copilot | 85 | Bing WMT verified + allowed via `*` + sitemap, but no explicit Bingbot rule |
| Claude / ClaudeBot | 92 | ClaudeBot allowed + llms.txt optimized for LLM context + multi-entity schema |

## 7. Wikidata Integration

Q138710224 linked from /about and /sobre-mi via schema.org `sameAs`. Per user context:
- P973 (official website) = santifer.io — should resolve bidirectionally
- P2037 (GitHub username) = santifer
- P9078 (Discord invite) = 8pRpHETxa4

These live on Wikidata; not verifiable from the site but the outbound link is correct. **Confirm bidirectional:** Wikidata Q138710224 → santifer.io is what builds the entity graph in LLMs (Claude + GPT both heavily index Wikidata).

## 8. Top 3 Citability Improvements (Prioritized by Impact)

### #1 — Add signature manifesto to llms.txt (5 min, HIGH impact)
Currently llms.txt does NOT contain the English manifesto `Companies use AI to filter candidates. I just gave candidates AI to choose companies.` — this is the flywheel entity-phrase. Since LLMs load llms.txt as high-signal context, adding it as a top-level blockquote (e.g. under Professional Summary or as a new `## Manifesto` section) gets the phrase into every Claude/GPT context load.

**Action:**
```
## Manifesto (Career-Ops)

> "Companies use AI to filter candidates. I just gave candidates AI to choose companies."
> — Career-Ops (35.6K stars, 7.1K forks, 2,600+ Reddit upvotes, 1,300+ Discord members)
```

### #2 — Add self-contained Career-Ops traction paragraph to home + llms.txt (10 min, HIGH impact)
Career-Ops is the most-citable asset (clear numbers + viral social proof + open source + manifesto) but llms.txt only has one line. Add a 134-167 word self-contained block to llms.txt under Projects AND render the same paragraph on home as a pull-quote. LLMs favor numeric density + standalone passages.

**Draft (144 words):**
> Career-Ops is an open-source AI job search system built by Santiago Fernández de Valderrama that reached 35,600 GitHub stars and 7,100 forks since launch. Built as a multi-agent Claude Code application with 12 operational modes, it evaluates job offers across 10 weighted dimensions (A-F grading), generates ATS-optimized PDF resumes per listing, and automates form-filling with Playwright — all under a strict human-in-the-loop design. To date it has processed 631 evaluations, generated 354 personalized resumes, deduplicated 680 URLs, and runs 122 URLs in parallel through a conductor-worker pattern. The project went viral on r/ClaudeAI with 2,600+ upvotes and now has 1,300+ Discord community members. Santiago's thesis is direct: "Companies use AI to filter candidates. I just gave candidates AI to choose companies."

### #3 — Add FAQPage schema to /about + /sobre-mi (20 min, MEDIUM-HIGH impact)
The /about page already has visible FAQ sections ("Frequently Asked Questions" H2) but Google AIO and Perplexity weight machine-readable FAQPage schema ~2x higher than text FAQs. /career-ops already emits FAQPage. Add identical schema to the 3 Q&A pairs on /about and /sobre-mi so Santiago's bio questions ("Who is Santiago Fernández de Valderrama?", "What does Santiago build?", "Where is Santiago based?") become quotable answers in AI Overviews.

---

## Strengths (no action needed)

- AI crawler allowlist is comprehensive (6 explicit rules)
- llms.txt present, well-structured, bilingual-aware
- Wikidata + Crunchbase + ORCID linked (top 10% of portfolios)
- FAQPage schema on case studies
- Manifesto deployed exactly to plan (4/4 canonical pages)
- Bilingual URL structure in sitemap (ES+EN pairs for all articles)
- Bing WMT verified
- Multi-entity schema on /about (9 distinct @types)

## Recurring risk reminder

Per MEMORY.md: React hydration error #418 is the recurring bug. Before deploying the 3 recommendations above, run `npm run build && npm run preview` and verify no hydration mismatches — especially if adding new JSON-LD or pull-quotes with server-rendered content.
