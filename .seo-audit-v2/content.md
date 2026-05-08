# Content + E-E-A-T Audit v2 — santifer.io (LIVE)

**Date:** 2026-04-22
**Baseline v1 (17 abr):** Content 84/100
**This audit:** Content **88/100** (Δ +4)
**Target review:** Hit 88+ as expected. Yes.

---

## Executive Summary

The batch of changes deployed between v1 and v2 moved the needle on three dimensions:

1. **Manifesto propagation** — the "Companies use AI to filter candidates..." line now appears verbatim on 5 touchpoints (/about, /sobre-mi, /career-ops-system EN, /career-ops ES, llms.txt, GitHub README). Creates a quotable identity hook that LLMs will repeat. Small wart: the line stays in English on /sobre-mi and /career-ops (Spanish). Arguable as intentional brand language, but causes mild linguistic dissonance on the Spanish pages.

2. **Applied AI Operator framing** — propagated to homepage JSON-LD `jobTitle[0]`, llms.txt, /about+/sobre-mi subtitles, and the GitHub profile. Works. Feels senior but is *more distinctive than generic* (unlike "AI Product Manager" which pattern-matches to 10,000 LinkedIn profiles). The subtle asymmetry: the `jobTitle` array on /about and /sobre-mi ProfilePage schema omits "Applied AI Operator" as index 0 — it only lives as a prose subtitle there. This is inconsistent with homepage which DOES include it in the array. Low-impact but a missed uniformity opportunity.

3. **Citations boost** — the net addition (+3 career-ops, +4 chatbot, +4 business-os, +4 pSEO = 15 new external citations) partially closes the Authoritativeness gap. It's present in JSON-LD (`citation[]`) but only 2 of the career-ops citations render as visible hyperlinks in the rendered HTML body (Anthropic Claude Code, Wikipedia Multi-Agent System). **The Authoritativeness lift underperforms because citations live mostly in structured data, not in-body prose.** This is the #1 residual gap.

---

## E-E-A-T Re-Score

| Factor | v1 | v2 | Δ | Rationale |
|---|---|---|---|---|
| Experience | 92 | **93** | +1 | Visible Updated dates (5 of 6 case studies — one ES route missing) add recency signal. External Discord proof (AU/Mbaku) NOT yet on-page, leaving a lift on the table. |
| Expertise | 88 | **89** | +1 | Manifesto creates ownership of a specific thesis. Applied AI Operator framing ties expertise to a category rather than a title. Minor. |
| Authoritativeness | 74 | **80** | +6 | Citations are present but mostly in JSON-LD. Wikipedia Multi-Agent System + Anthropic Claude Code + Building Effective Agents all credible. Missed opportunity: visible inline citations in prose (currently only 2 per page render as anchor tags in body). |
| Trustworthiness | 85 | **87** | +2 | Visible Updated dates on 5/6 case studies is a strong recency signal that QRG explicitly rewards. "Updated Apr 18, 2026" on career-ops is fresh (4 days stale as of this audit, safe). CTA label retext ("Prueba career-ops" + "View source on GitHub") is more honest than generic "Try it". BMC removal = zero monetization = pure trust. |

**Weighted total:** Experience (20% · 93) + Expertise (25% · 89) + Authoritativeness (25% · 80) + Trustworthiness (30% · 87) = **86.7 → rounds to 87 on E-E-A-T subcomponent.**

Content score 88/100 ties E-E-A-T + structure + AI readiness + consistency.

---

## Per-Question Findings

### 1. Did manifesto propagation work? Coherent or dissonant?

**Working.** 6 surface appearances verified:
- `/about` — in prose, position: pre-summary subtitle. ✓
- `/sobre-mi` — in prose verbatim English. ✓ (dissonance: rest of page is Spanish)
- `/career-ops-system` EN — prose hero sub-headline. ✓
- `/career-ops` ES — prose hero sub-headline, kept in English. ✓ (same dissonance)
- `/llms.txt` — under `## Manifesto` heading. ✓
- GitHub profile README — opening quote. ✓

**The dissonance is a design choice, not a bug.** Keeping the manifesto in English on Spanish pages preserves the punchline quotability and signals that this is a tagline / brand asset rather than body copy. Risk is low — but a tiny editor's note could help ("El manifesto que guía career-ops:" + quote).

**LLM citation readiness for the manifesto: HIGH.** It's under 20 words, cites both sides of a paradox, and is a self-contained quotable unit. Expect this to become the line LLMs use when summarizing Santiago.

### 2. Does "Applied AI Operator" transmit $500K seniority?

**Partially.** The framing itself is differentiated and senior-coded: it bundles "ships to prod" with "operator" (ownership signal) without the tired "Senior/Staff/Principal" tax. But the $500K+ perception comes from *what's near it*, not the label alone. Supporting signals on-page that help:

- "Head of Applied AI" as current role (on homepage and /about)
- "Creator of Career-Ops (37.6K+ ⭐)" — open-source traction as proof
- "Built and sold a 16-year business in 2025" — founder/exit signal
- "Teaching Fellow at AI Product Academy"

What's missing for top-band comp framing:
- No compensation/budget authority signals (headcount managed, revenue owned, cost reductions)
- No enterprise/household-brand client logos
- No speaking/writing at scale (keynotes, published works beyond dev.to)

Verdict: the framing *unlocks* $300–400K narrative. For $500K+ it needs adjacent signals. This is a PR problem, not a content problem.

### 3. Do visible "Updated: DD MMM YYYY" dates age well?

**5 of 6 case studies have them:**
- career-ops-system: Updated Apr 18, 2026 ✓ fresh
- ai-agent-jacobo: Updated Mar 7, 2026 ✓
- business-os (ES): Actualizado 6 mar 2026 ✓ (ES page renders the ES label correctly)
- self-healing-chatbot: Updated Mar 14, 2026 ✓
- programmatic-seo: Updated Mar 10, 2026 ✓
- `business-os` EN route: **"NOT FOUND"** in rendered HTML → likely rendering as Actualizado because route defaults to ES? Verify.
- `seo-programatico` + `agente-ai-jacobo` ES slugs: **"NOT FOUND"** — rendering issue with the Spanish slugs. Verify prerender.

**Aging risk:** As of 22 Apr, the oldest date shown is 6 Mar (~47 days). At 90 days staleness the signal inverts (reads as abandoned). Recommend:
- Add a CI check that fails if any `dateModified` is >90 days old
- Prefer relative dates ("Last reviewed 6 weeks ago") for rarely-touched case studies, absolute for actively-maintained ones

Career-ops dated Apr 18 will become stale fast because the project is active (37.6K stars, Discord grows weekly). **Set up a nightly/weekly tick to bump `dateModified` on career-ops-system when the stars count on the page changes.**

### 4. Do citations resolve the Authoritativeness 74 → target 85?

**Partial. Moved to 80.** Reasons it didn't hit 85:

- The citations land in JSON-LD `citation[]` arrays, which search engines parse but users don't see. For E-E-A-T, visible in-body links matter more for the "authoritativeness" axis because they signal to readers (and to Perplexity/SearchGPT crawlers) that the content derives from primary sources.
- External link audit of career-ops page body rendered HTML: 2 authority anchors (Anthropic + Wikipedia) out of ~30 total external links. Chatbot is better (OWASP, Anthropic prompt injection, Langfuse docs, Supabase pgvector all rendered). Business-OS and pSEO have decent visible links but they're mostly to tool homepages (airtable.com, astro.build) not authoritative knowledge sources.
- Zero academic/.edu citations, zero standards body references beyond OWASP and schema.org.

**To hit 85:** inline 3-5 visible authority citations per long-form case study in the prose itself, as <a> tags with descriptive anchor text. Example: "using [retrieval-augmented generation](wikipedia)..." or "following [Anthropic's prompt injection guidance](anthropic.com/news)..."

### 5. AI citation readiness post changes

**Improved from v1. Score: 87/100.**

Quotable atoms now available for LLMs:

1. **Manifesto** — "Companies use AI to filter candidates. I just gave candidates AI to choose companies." (perfect atomic unit: <20 words, memorable, ownable)
2. **Career-ops stats** — "631 offers, 354 PDFs, 37.6K+ stars, 1,600+ Discord" (batched stats hook)
3. **Jacobo outcome** — "~90% customer self-service rate" (clean numeric)
4. **pSEO outcome** — "4,730 pages, 10.8x traffic, 2M+ impressions" (all visible)
5. **Chatbot posture** — "71 evals, 6-layer prompt injection defense" (matches the HTML comment on `<!doctype>` too — nice touch)

Structure: Headings follow clear Q→A patterns on case studies ("Why Did I Need to Automate…?", "How Does the Multi-Agent System Work?") which is optimal for LLM extraction. FAQ sections remain the bottleneck: 12 FAQ answers <100 words (consciously skipped per your note). AI Overviews / Perplexity prefer 50-150 word atomic answers, so the short ones (~30-50 words on some) truncate context. Keeping them short is the *right* call — but consider expanding 3-4 to 120 words where complexity warrants.

### 6. New anti-patterns introduced by changes?

Three flagged, all minor:

1. **Asymmetric jobTitle arrays.** Homepage ProfilePage JSON-LD includes "Applied AI Operator" as index 0. `/about` and `/sobre-mi` ProfilePage JSON-LD do NOT (starts with "Head of Applied AI"). This is invisible to users but a validation nuisance and makes LLM-derived summaries inconsistent depending on which URL gets scraped.

2. **English manifesto on Spanish pages.** Intentional but under-contextualized. A 4-word lead-in would solve it.

3. **Stars count desync.** /sobre-mi still mentions "37.6K+ ⭐" in the main summary but also shows "36.2K+ ⭐" in the subtitle (see curl output line 23). That's a stale number from an older build. Not catastrophic but the inconsistency is visible to a careful reader — hurts Trustworthiness by a micro-amount.

### 7. External testimonials (AU, Mbaku) on-page?

**No, currently Discord-only.** This is a lift lever still pending. Recommend a dedicated `## What the Community Built` section on `/career-ops-system` with 2-3 real user quotes (redacted or first-name + initial only, with consent). This directly raises Experience ("others use this in real hiring situations") AND Authoritativeness (social proof from outside your control).

---

## Content Length Audit

| Page | Words | Min required | Status |
|---|---|---|---|
| Homepage | 2,194 | 500 | 4.4× ✓ |
| /about | 767 | 500 | 1.5× ✓ |
| /sobre-mi | 817 | 500 | 1.6× ✓ |
| /career-ops-system | 2,580 | 1,500 | 1.7× ✓ |
| /self-healing-chatbot | 3,022 | 1,500 | 2.0× ✓ |
| /business-os | 4,785 | 1,500 | 3.2× ✓ |
| /programmatic-seo | 7,619 | 1,500 | 5.1× ✓ |
| /ai-agent-jacobo | 10,593 | 1,500 | 7.1× ✓ (inflated by JSON-LD bleed — real prose ~4–5K) |

All pages comfortably above thresholds. No word-count concerns.

---

## AI-Generated Content Markers (Sept 2025 QRG)

No red flags. The content reads as first-person lived experience. Specific markers that pass:
- Numbered metrics that are falsifiable (631 evals, 4,730 pages, not round numbers)
- First-person narrative with decisions ("I built…", "I decided…")
- Self-critical framings ("The irony: I built a multi-agent system to search for multi-agent roles")
- Specific tool decisions with rationale ("Why Modes, Not One Prompt")
- Lessons section (8 on career-ops) — hard to fake because it reveals trade-offs

No repetitive AI-template phrasing detected across pages.

---

## Top 3 New Quick Wins (v2 → v3)

1. **Inline 3 visible citation links in career-ops-system prose** — target: Anthropic "Building Effective Agents" (link from "multi-agent system" phrase), Wikipedia Multi-Agent System (already in JSON-LD, not visible in body), Palantir's FDE role (link from "Forward Deployed Engineer"). Effort: 20 min. Impact: Authoritativeness 80 → 83–84. One change, measurable SGE/Perplexity benefit.

2. **Add a 3-quote "Community Results" block on /career-ops-system** — use AU's "landed first interview" and Mbaku's "second company reach-out" with link back to the Discord thread (#show-your-results). Adds external social proof *you didn't author*. Effort: 45 min + DM consent from both users. Impact: Experience 93 → 95, Trustworthiness 87 → 89, and fills the Reddit/HN credibility gap when the page gets shared.

3. **Unify jobTitle arrays + fix stars desync on /sobre-mi** — (a) add "Applied AI Operator" as `jobTitle[0]` in ProfilePage JSON-LD on /about and /sobre-mi to match homepage. (b) sync 36.2K→37.6K on /sobre-mi subtitle. (c) add a CI check that fails PR if the star count in prose diverges from the JSON-LD `interactionStatistic` or homepage. Effort: 30 min. Impact: cleans 3 anti-patterns and raises Trustworthiness micro-component.

---

## Scorecard

```
Content Quality Score: 88/100 (Δ +4 vs v1 baseline 84)

E-E-A-T Breakdown:
  Experience:         93 (Δ +1)
  Expertise:          89 (Δ +1)
  Authoritativeness:  80 (Δ +6)
  Trustworthiness:    87 (Δ +2)
  Weighted:           86.7

AI Citation Readiness: 87/100 (Δ +4)

Pending levers for v3:
  - Visible inline authority citations in prose
  - External community testimonials (AU, Mbaku) lifted from Discord
  - jobTitle array unification + stars desync fix
```
