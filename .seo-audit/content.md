# Content Quality + E-E-A-T Audit — santifer.io

Audit date: 2026-04-17  •  Scope: LIVE pages  •  Framework: Google QRG Sept 2025

## 1. Scorecard

| Page | Words | Sentences | Avg sent len | Ext links | Unique domains | H2 | H3 | Pub | Mod |
|------|------:|----------:|-------------:|----------:|---------------:|---:|---:|-----|-----|
| `/` home | 2,192 | 89 | 24.6 | 45 | 9 | 7 | 27 | — | 2026-04-17 |
| `/about` | 764 | 34 | 22.5 | 14 | 12 | 8 | 0 | — | 2026-04-08 |
| `/career-ops` | 2,711 | 223 | 12.2 | 7 | 5 | 11 | 8 | 2026-03-17 | 2026-04-17 |
| `/agente-ia-jacobo` | 10,877 | 647 | 16.8 | 28 | 9 | 16 | 31 | 2026-02-25 | 2026-03-07 |
| `/business-os-para-airtable` | 4,780 | 243 | 19.7 | 11 | 8 | 13 | 8 | 2026-02-25 | 2026-03-06 |
| `/seo-programatico` | 8,352 | 567 | 14.7 | 15 | 8 | 21 | 37 | 2026-02-25 | 2026-03-10 |
| `/chatbot-que-se-cura-solo` | 3,205 | 235 | 13.6 | 5 | 3 | 13 | 19 | 2026-03-11 | 2026-03-14 |
| `/n8n-para-pms` | 1,685 | 106 | 15.9 | 11 | 5 | 9 | 2 | 2026-02-24 | 2026-03-06 |

All pages clear the QRG topical-coverage floor for their page type (home ≥500, case studies ≥1,500). `/about` is at 764 words — below blog-post floor but appropriate for an entity/bio page; classifies more as `ProfilePage`.

## 2. E-E-A-T breakdown

Weighted per Sept 2025 QRG.

| Factor | Weight | Score | Notes |
|--------|-------:|------:|-------|
| Experience | 20% | 92 | Strong first-person voice, "Lo construí con Claude Code", concrete metrics (631 evaluaciones, 35.6K+ stars, 30K repairs). Manifesto is grounded in lived outcome ("ahora soy Head of Applied AI"). |
| Expertise | 25% | 88 | Technical depth on Jacobo (10,877 words, 16 H2s, 31 H3s) and pSEO (8,352 w, 21 H2s, 37 H3s) is excellent. Architecture diagrams, tool-calling flows, HITL patterns. Slight weakness: career-ops H2 count (11) vs body size implies some sections are dense without sub-structure. |
| Authoritativeness | 25% | 74 | About page is strong (12 unique external domains — ORCID, Stack Overflow, Crunchbase, Diario de Sevilla, LinkedIn, GitHub, X, Reddit, substack, dev.to). BUT flagship `/career-ops` only cites 5 domains (linkedin, buymeacoffee, github, maven, discord). Case studies should cite source tools/frameworks/papers to establish authority. `/chatbot-que-se-cura-solo` cites only 3 domains — weakest. |
| Trustworthiness | 30% | 85 | datePublished + dateModified present as JSON-LD on all case studies. Author = `@id` ref to Person entity (resolvable). Contact info visible. No dark patterns. Gap: no visible human-readable "Last updated" string on case study pages — dates live in JSON-LD only. |

**Weighted content score: 84/100**

## 3. FAQ answer length warnings (AI citation readiness)

Build validator flags 7 articles × 2 langs = **12 instances** below 100-word threshold for AI-citation self-containment:

| Article | Lang | Shortest answer (words) |
|---------|:----:|------------------------:|
| n8n-for-pms | ES | 47 |
| n8n-for-pms | EN | **22** |
| jacobo | ES | 50 |
| jacobo | EN | 43 |
| business-os | ES | 50 |
| business-os | EN | 47 |
| programmatic-seo | ES | 54 |
| programmatic-seo | EN | 45 |
| self-healing-chatbot | ES | 28 |
| self-healing-chatbot | EN | 28 |
| career-ops | ES | 31 |
| career-ops | EN | **27** |

Impact: ChatGPT/Perplexity prefer FAQ answers that are self-contained at ≥80–120 words because the snippet must stand on its own when surfaced. 22–31 word answers get truncated or merged and lose attribution.

Priority fix order (by traffic potential): career-ops EN (27), self-healing-chatbot both (28), n8n-for-pms EN (22).

## 4. Readability (Hemingway-style pass)

- Home: avg 24.6 words/sentence — borderline. Contains marketing-style compounded sentences in hero. Trim to avg ~18 for scannability.
- About: 22.5 — acceptable for bio prose.
- Career-ops: 12.2 — excellent. Only 3.6% sentences >30 words, and those are tables being linearized (not real prose).
- Jacobo & pSEO: 14.7–16.8 — ideal for technical content.
- Business-os: 19.7 — slightly heavy, tighten 2–3 paragraphs.

No paragraph-length issues detected. Heading density (H2+H3) is healthy on all case studies except `/n8n-para-pms` (2 H3s for 1,685 words → flat structure).

## 5. Manifesto placement

**Live text (ES+EN identical):** *"Companies use AI to filter candidates. I just gave candidates AI to choose companies."*

- `/career-ops`: byte offset 39% — appears after hero image, before first H2. Wrapped in `<Manifesto>` component (editorial pull-quote). **Properly contextualized** — immediately followed by the "Lo construí con Claude Code…" lede. Good.
- `/about`: byte offset 58% — appears after "April 2026" date and before the "Spanish tech entrepreneur…" bio paragraph. Good placement as thesis statement bridging header to body.

**Gap:** The manifesto is a quote-worthy thesis but is NOT wrapped in `<blockquote>` with a `cite` attribute in the HTML output, and no `Quotation` schema in JSON-LD. Adding schema.org `Quotation` or a `<blockquote cite="https://santifer.io/about">` would make it explicitly quotable by LLMs and increase citation probability.

## 6. AI citation readiness

Career-ops body contains **21 concrete stat-laden lines** (e.g., "631 evaluaciones después, Career-Ops filtraba mejor que yo", "El 70% de las ofertas no encajan", "35.6K+ estrellas"). This is excellent — these are the exact self-contained sentences LLMs quote.

Weakness: FAQ answers (see §3) are the section LLMs preferentially extract, and they're too short on 6 articles. Fixing FAQ answer length would be the single highest-leverage AI-citation improvement.

## 7. Thin content detection

None. Smallest page (`/about` at 764 words) is a ProfilePage and appropriately sized. No duplicated boilerplate across case studies detected — each has its own i18n file and unique sections.

## 8. AI-generated content quality (Sept 2025 QRG markers)

No red flags. Content shows:
- First-person experience signals ("ahora soy", "lo construí", "631 evaluaciones")
- Specific numbers tied to named projects and time periods
- Named tools, companies, people (Datadog, Langfuse, Marily for n8n collab, LICO Cosmetics, Everis)
- Opinion + unique framing (manifesto inversion of AI-filter narrative)
- No generic "In today's fast-paced world" phrasing

Content reads as human-authored with AI assistance, not AI-generated. Passes QRG.

## 9. Top 3 quick wins

1. **Fix FAQ answer lengths** (12 instances). Target 100–140 words each. Start with career-ops EN (currently 27 words). Highest AI-citation ROI. Run `/seo content` per build hint.
2. **Add external citations to `/career-ops` and `/chatbot-que-se-cura-solo`**. Career-ops cites only 5 domains despite being the flagship (35.6K stars). Link to LangChain docs, Claude Code docs, Playwright, n8n, Anthropic API, DataForSEO — whichever tools the system actually uses. Target ≥10 unique external domains. Raises Authoritativeness from 74 → ~85.
3. **Add visible `Last updated` on case study pages** (currently only in JSON-LD). A human-visible "Last updated: 2026-04-17" under the H1 strengthens Trustworthiness and gives LLMs an explicit freshness cue when they parse DOM.

## 10. Additional recommendations (not in top 3)

- Wrap the manifesto in `<blockquote cite="…">` + schema.org `Quotation` for explicit quotability.
- `/n8n-para-pms` has only 2 H3s for 1,685 words — add sub-headings.
- Home H1 is empty in server-rendered HTML (relies on client render). Confirm prerender emits an H1 for the home route.
- Consider adding `hasPart` / `speakable` schema on career-ops for voice-assistant surfacing.

---

**Final content quality score: 84/100**
- E-E-A-T weighted: 84
- Readability: 88
- AI citation readiness: 76 (dragged down by short FAQ answers)
- Content minimums: 100
- No thin content, no AI-quality red flags
