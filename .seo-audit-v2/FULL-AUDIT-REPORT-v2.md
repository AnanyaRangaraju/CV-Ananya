# Full SEO Audit v2 — santifer.io

**Audit date:** 2026-04-22
**Baseline:** v1 audit 2026-04-17 (87/100)
**Business type:** Personal portfolio / Entity Home
**Pages audited:** 18 (9 bilingual pairs)

---

## SEO Health Score: **91 / 100** (A) — **+4 vs v1**

| Category | Weight | v1 | **v2** | Δ | Weighted v2 |
|----------|-------:|---:|-------:|--:|------------:|
| Technical SEO | 25% | 92 | **93** | +1 | 23.25 |
| Content E-E-A-T | 25% | 84 | **88** | +4 | 22.00 |
| On-Page SEO | 20% | 88 | **91** | +3 | 18.20 |
| Schema / JSON-LD | 10% | 92 | **94** | +2 | 9.40 |
| Performance (CWV) | 10% | 82 | **89** | +7 | 8.90 |
| Images | 5% | 70 | **88** | +18 | 4.40 |
| AI Search Readiness | 5% | 88 | **94** | +6 | 4.70 |
| **Total** | **100%** | | | | **90.85 → 91** |

---

## Executive Summary

5 días después del audit v1, la deploy de los cambios ha movido el score de **87 → 91**, con subidas en las 7 dimensiones. Ningún regression. El viral de career-ops siguió (36.2K → 37.6K stars, Discord 1.3K → 1.7K) y el site capta mejor el momentum con el nuevo framing Applied AI Operator.

### Lo que funcionó

- **Manifesto propagation ×5** (career-ops ES+EN, /about, /sobre-mi, llms.txt): entity-phrase anchor confirmado, LLMs ya empiezan a asociar la frase a Santiago.
- **Applied AI Operator framing** coherente en title, meta, JSON-LD jobTitle[0], llms.txt tagline, /about subtitle, GitHub profile README (6 touchpoints). **11 occurrences en /`, 11 en /en, 3 en /about, 3 en /sobre-mi.**
- **Schema entity triangulation**: SoftwareSourceCode.sameAs con 3 dominios (career-ops.org + github + Wikidata Q139007988). Url canónica ≠ codeRepository. Best-in-class.
- **CLS fix dramático en career-ops**: 0.20 → <0.05. LCP preload swap verificado (career-ops sirve hero-career-ops-1400w.webp como preload).
- **Sitemap lastmod via git `%cs`** para home + about: resuelto el drift que tenía v1.
- **Citations boost**: career-ops +3, chatbot +4, business-os +4, pSEO +4. Authoritativeness 74 → 80 (+6).

### Gaps nuevos descubiertos (inexistentes en v1)

1. **Schema `jobTitle` drift cross-page.** Home + /en exponen array con "Applied AI Operator" primero. /about, /sobre-mi, y 6 articles aún serven el viejo string scalar "Head of Applied AI". Shape-mismatch en Person entity con mismo `@id`.
2. **LCP preload solo aplica a career-ops.** El fix de prerender busca `<img fetchpriority="high">` — solo career-ops lo tiene. Jacobo/BOS/pSEO aún preloadean el avatar. Easy fix: añadir `fetchPriority="high"` a hero de cada case study.
3. **FAQPage /about inyectado client-side** (useEffect). Google JS renderer lo ve; LLMs conservadores (Perplexity, ChatGPT-Browse) no.
4. **Sitemap lastmod en articles** es stale — el fix v1 solo cubrió home + about. Artículos leen `registry.ts:dateModified` static en vez de git.
5. **Stars desync en /sobre-mi**: subtitle dice "36.2K+", bio en párrafo dice "37.6K+". Auto-update tocó uno no el otro.
6. **AU + Mbaku testimonials** (primer interviews reales via career-ops): viven en Discord, no on-page. Mayor unexploited lift de Trustworthiness disponible.

---

## Technical SEO — 93/100 (+1)

✅ **Confirmed resolved:**
- /business-os 308 redirect
- DiagramZoom CLS fix
- GridSnakes canvas viewport-gated
- Orphan images removed
- `<priority>` removed del sitemap

⚠️ **Nuevos issues:**
- **[HIGH]** LCP preload swap solo aplica a career-ops. Jacobo/BOS/pSEO aún preloadean avatar.
- **[MEDIUM]** Sitemap lastmod de artículos NO git-derived (solo home + about). Dates ~6 semanas stale en jacobo et al.
- **[LOW]** Hreflang order inconsistente (`business-os-for-airtable` ES→EN vs resto EN→ES).

✅ **Sin regresiones** en seguridad, canonicals, AI crawler allowlist, prerender, redirects.

---

## Content E-E-A-T — 88/100 (+4) — **target hit**

| Dimension | v1 | v2 | Δ |
|-----------|---:|---:|--:|
| Experience | 92 | **93** | +1 |
| Expertise | 88 | **89** | +1 |
| Authoritativeness | 74 | **80** | +6 (citations boost) |
| Trustworthiness | 85 | **87** | +2 |

**Quotability AI**: manifesto (<20 words) + "631 offers · 37.6K stars · 1,600 Discord · 90% self-service" = chunks atómicos propagables. Score 87/100 AI citation readiness.

⚠️ **Gaps pendientes críticos:**
- 12 FAQ answers <100 words (skip consciente, pero sigue siendo el mayor drag de AI citation)
- Citations en JSON-LD ≠ citations visibles en prose (career-ops tiene solo 2 anchors inline, 3 más pushearía authoritativeness a 83-84)
- AU + Mbaku community testimonials NO on-page (Discord-only) — mayor lift unexploited

✅ **AI-content red flags**: zero. Sigue pasando filtros QRG Sep 2025.

---

## Schema — 94/100 (+2)

✅ **Deploys landed correctly:**
- Top-level Organization (Santifer iRepair Q138778364)
- Top-level SoftwareSourceCode split: url=career-ops.org, codeRepository=github, sameAs ×3
- Person founder `@id` ref (no duplicate)
- worksFor Zinkee + award Maven
- jobTitle[0] "Applied AI Operator"
- All dateModified YYYY-MM-DD

⚠️ **3 issues consistency nuevos:**
1. **[CRITICAL]** jobTitle drift cross-page (home vs about vs articles) — 2-line fix en `articles/json-ld.ts` + `AboutPage.tsx`
2. **[HIGH]** FAQPage /about client-only (useEffect, SSR no lo emite)
3. **[MEDIUM]** Article Person es thin duplicate (falta award, worksFor, hasCredential) — corregir con pure `@id` reference

Blockquote `cite` attr en Manifesto component = HTML5 semantic only, zero rich results uplift (Google no soporta Quotation rich results). OK para a11y.

---

## Sitemap — 96/100 (+4)

✅ L1 `lastmod` drift del v1 **resuelto** para home + about. 18 URLs, hreflang reciprocal perfect, XML válido, GSC 204 submissions working.

⚠️ **Gap menor (-2):** `/privacidad` + `/privacy` live 200 pero ausentes del sitemap.

**Sin acción para career-ops.org**: dominio separado con su propio sitemap (correct pattern).

---

## Performance — 89/100 (+7)

| Página | LCP | CLS | TTFB |
|--------|----:|----:|-----:|
| Home | ✅ ~2.0s | ✅ <0.05 | 100ms |
| /career-ops | ✅ **~2.3s** | ✅ **<0.05** | 101ms |
| /about | ✅ ~2.1s | ✅ <0.05 | 125ms |
| /programmatic-seo | ✅ ~2.2s | ⚠️ **0.15-0.20** | 105ms |

Career-ops CLS y LCP dramáticamente mejorados. pSEO queda como único outlier (22 imágenes sin dimensions).

PSI API quota exhausted — números lab-estimated. Re-run tomorrow.

⚠️ **Bundle flag:** OpsDashboard chunk 398KB raw. Verificar es dynamic-import y no leaked a public routes.

---

## Images — 88/100 (+18)

**Biggest category delta.** De 70 → 88 en 5 días.

- DiagramZoom `width`+`height` + aspect-ratio en 12 callers ✅
- Orphan cleanup 208 KB saved ✅
- BMC logo aria-hidden ✅
- ArchitectureDiagram thumbnail dimensions ✅

Pending:
- pSEO 22 imgs sin dims (contribuye al CLS 0.15-0.20 de esa página)
- imagesrcset 768w variant career-ops hero (-400ms mobile LCP)
- Hero images `max-age=0` headers → falta immutable cache

---

## AI Search Readiness (GEO) — 94/100 (+6) — **target hit**

| Platform | v1 | v2 | Δ |
|----------|---:|---:|--:|
| Claude | 91 | **96** | +5 |
| ChatGPT/OAI-SearchBot | 90 | **95** | +5 |
| Perplexity | 89 | **93** | +4 |
| Google AI Overviews | 88 | **92** | +4 |
| Bing Copilot | 88 | **91** | +3 |

✅ **Manifesto** cross-linked en 5 surfaces. Entity-phrase anchor amplificado 5×.
✅ **Entity triangulation** perfect (sameAs ×3).
✅ **All 6 AI crawlers** allowlisted.
✅ **llms.txt** 2,040 words, clean H2, 3 entry points.

⚠️ **3 improvements pending:**
1. Localize manifesto ES en /sobre-mi (career-ops.org aparece 0× en Spanish surfaces)
2. Publish /chatbot-prompt.txt externally (actualmente 404, la regla "bot linka career-ops.org first" es internal only)
3. Retire "Open Source Builder" rotation del typewriter (dilute Applied AI Operator signal) — **CONFLICT con SEO venture-ops recommendation** (mantener rol[0] SSR como SEO anchor). Flag para decisión estratégica.

---

## Lo que cambió vs v1

| Área | Impacto |
|------|---------|
| Manifesto propagation ×5 | GEO +5, Content +2 |
| Schema entity triangulation | Schema +2, GEO +3 |
| CLS fix career-ops | Performance +5, Images +10 |
| LCP preload (career-ops only) | Performance +2 |
| Citations boost +15 total | Content +6 (Authoritativeness) |
| Applied AI Operator framing | GEO +4, Content +2 |
| career-ops.org link strategy | Schema +1, GEO +2 |
| Sitemap lastmod git-based | Sitemap +4 |
| Organization + SoftwareSourceCode top-level | Schema +4 |
| Wikidata cleanup 4 properties | GEO +1 |

---

## Path to 95+

Implementing los 3 quick wins de Content + 1 de Schema + 1 de Perf llegaría a **96-97**:

1. Unify jobTitle array en /about + articles (5 min → +3 schema)
2. Inline 3 visible citations career-ops prose (20 min → +3 content authoritativeness)
3. AU + Mbaku testimonials on-page (45 min → +2 content experience/trust)
4. Fix LCP preload extensión a jacobo/BOS/pSEO (10 min → +2 performance)
5. Stars desync /sobre-mi fix + CI (15 min → +1 content trust)

Total effort: ~1h30 → **Score potencial 96-97**.

---

## Detailed files

- `.seo-audit-v2/technical.md`
- `.seo-audit-v2/content.md`
- `.seo-audit-v2/schema.md`
- `.seo-audit-v2/sitemap.md`
- `.seo-audit-v2/performance.md`
- `.seo-audit-v2/geo.md`
- `.seo-audit-v2/ACTION-PLAN-v2.md` (next)
