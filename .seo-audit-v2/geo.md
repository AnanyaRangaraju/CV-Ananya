# GEO Audit v2 — santifer.io (LIVE)

**Date:** 2026-04-17 | **v1 score:** 88/100 | **v2 score:** 94/100 | **Delta:** +6

---

## GEO Readiness Score: 94/100

| Dimension | Weight | v1 | v2 | Delta | Notes |
|---|---|---|---|---|---|
| Citability | 25% | 22 | 24 | +2 | Manifesto as self-contained 134-word chunk (llms.txt) hits optimal passage range. Direct-answer first-sentence pattern. |
| Structural Readability | 20% | 18 | 19 | +1 | llms.txt clean H2 hierarchy, 3 entry points separated (Landing / Case Study / Source). |
| Multi-Modal | 15% | 13 | 13 | 0 | No change — OG images intact, avatar preloaded. |
| Authority & Brand | 20% | 18 | 20 | +2 | Applied AI Operator propagated across 6 touchpoints; jobTitle[0] upgraded; Wikidata Q139007988 + sameAs triangulation complete. |
| Technical Accessibility | 20% | 17 | 18 | +1 | SSR intact, all AI crawlers Allow, sitemap clean (18 URLs). Minor deduction: /chatbot-prompt.txt returns 404 publicly. |

---

## AI Crawler Access (robots.txt live-verified)

GPTBot / ChatGPT-User / OAI-SearchBot / ClaudeBot / PerplexityBot / Google-Extended — all explicit Allow. Sitemap + IndexNow key present. Exemplary.

---

## Manifesto Cross-Linking (5 target locations)

| Location | Present | Lang served |
|---|---|---|
| /career-ops (ES) | Yes | EN canonical |
| /career-ops-system (EN) | Yes | EN |
| /about (EN) | Yes | EN |
| /sobre-mi (ES) | Framing present, manifesto line in EN | ES page |
| /llms.txt | Yes | EN exact |

Entity-phrase "Companies use AI to filter candidates. I just gave candidates AI to choose companies." amplified 5×. Clean anchor for LLM attribution.

## Applied AI Operator Framing

| Surface | Occurrences |
|---|---|
| / (home ES) | 11 |
| /en | 11 |
| /about | 3 + 1 Head of Applied AI |
| /sobre-mi | 3 |
| JSON-LD jobTitle[0] | Applied AI Operator |
| llms.txt tagline | Present |

Residual: "Open Source Builder" still rotates 1× on home hero.

## llms.txt Structure

~2,040 words. Career-Ops block is the most quotable chunk (traction: 631 offers, 37.6K stars, 7.1K forks, 2,600+ Reddit, 1,300+ Discord). 3 entry points explicit. No duplication or malformed sections.

## Entity Graph (SoftwareSourceCode)

sameAs = [career-ops.org, github.com/santifer/career-ops, Wikidata Q139007988]. `url` = career-ops.org (canonical home). `codeRepository` = GitHub. Best-in-class disambiguation.

---

## Platform-Specific Scores

| Platform | Score | Delta v1 |
|---|---|---|
| Google AI Overviews | 92 | +4 |
| ChatGPT / OAI-SearchBot | 95 | +5 |
| Claude | 96 | +5 |
| Perplexity | 93 | +4 |
| Bing Copilot | 91 | +3 |

## Brand Mentions

Wikidata (person Q138710224 + project Q139007988), YouTube (@santifer_io), Reddit (2,600+ upvotes), LinkedIn (300+/115+/65+ eng), GitHub 37.6K, Discord 1,300+, Hugging Face, Stack Overflow, ORCID, Crunchbase — all in sameAs.

---

## Top 3 Pending Improvements

### 1. Localize manifesto to Spanish in /sobre-mi and /career-ops (S, High)
Add adjacent ES version: "Las empresas usan IA para filtrar candidatos. Yo le di a los candidatos IA para elegir empresas." Keep EN canonical for attribution; add ES for SERP/LLM coverage in Spanish. Also: career-ops.org is absent from /sobre-mi (0 mentions) — add at least one link to close the triangulation on Spanish surfaces.

### 2. Publish /chatbot-prompt.txt publicly (XS, Medium)
Currently returns 404. If the "bot links career-ops.org first, github second" rule is only internal, other LLMs cannot replicate it. Publish an abbreviated 150-300-word public version (or append to llms.txt).

### 3. Retire "Open Source Builder" rotation on home hero (XS, Low-Medium)
1 residual occurrence dilutes entity signal. `jobTitle[0]` is Applied AI Operator; page copy should mirror. Single dominant label wins the LLM embedding vote.

---

## Artifacts Verified

- robots.txt: all AI crawlers explicitly allowed
- llms.txt: manifesto + traction chunk + 3 entry points
- JSON-LD: Person + SoftwareSourceCode with sameAs array (3 domains)
- Sitemap: 18 URLs with correct hreflang
- career-ops.org: HTTP 200
- chatbot-prompt.txt: HTTP 404 (gap)
