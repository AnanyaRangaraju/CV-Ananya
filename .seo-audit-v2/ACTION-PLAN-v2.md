# Action Plan v2 — santifer.io (22 abr 2026)

**Current: 91/100** → Target: **96+**

Pending items desde el v2 audit, priorizados por impact/effort.

---

## Critical
*Blocks indexing / penalties.*

**None.** Site sano.

---

## High
*Significant impact on score. Fix this week.*

### H1. Unify jobTitle array cross-page
**Score impact:** +3 schema (→ 97)
**Effort:** 5 min
**Files:**
- `src/articles/json-ld.ts:49` — Person jobTitle scalar → array
- `src/AboutPage.tsx:63` — mismo fix

**Why:** home + /en exponen jobTitle array con `["Applied AI Operator", "Head of Applied AI", ...]` (5 items). /about, /sobre-mi, y los 6 case studies aún serven string scalar `"Head of Applied AI"`. Person tiene mismo `@id` cross-page → Google/LLMs ven shape mismatch → entity reconciliation fragile.

**Fix:** usar array consistente en los 9 lugares. Todos los articles deberían heredar del mismo Person object o referenciar por `@id` only.

### H2. Extend LCP preload swap a jacobo/chatbot/BOS/pSEO/n8n
**Score impact:** +2 performance (→ 91)
**Effort:** 10 min
**Files:**
- `src/JacoboAgent.tsx` — añadir `fetchPriority="high"` al hero img
- `src/BusinessOS.tsx` — idem
- `src/ProgrammaticSeo.tsx` — idem
- `src/SelfHealingChatbot.tsx` — idem
- `src/N8nForPMs.tsx` — idem

**Why:** el fix prerender.tsx swap solo dispara cuando encuentra `<img fetchpriority="high">` en el HTML renderizado. Solo career-ops lo tiene. Los demás artículos siguen preloadeando el avatar del home (6 KB) en vez de su propio hero (100-200 KB). Pérdida estimada 200-400 ms LCP en cada artículo.

### H3. AU + Mbaku community testimonials on-page
**Score impact:** +2 content (→ 90) — mayor unexploited lift de Experience+Trust
**Effort:** 45 min + DM de consent
**Location sugerida:** nueva sección en `/career-ops` ES+EN, justo antes del CTA block. O en home como social proof.

**Data capturable del Discord brain:**
- AU: **FIRST INTERVIEW** via career-ops (20 abr). Claude Pro $20, 19 evaluadas, 5 applied, 1 interview, 2 rejected, 5 discarded.
- Mbaku: 2nd company reached out for interview (20 abr).
- +1,753 Discord members (crecimiento ~100/day).

**Content sugerido:**
```markdown
## Real results from the community

> "Got my first interview using career-ops — 19 offers evaluated, 5 applied, 1 interview landed. Total cost: $20 Claude Pro."
> — AU, career-ops user (20 apr 2026)

> "Second company reached out for an interview after applying via career-ops."
> — Mbaku, career-ops user (20 apr 2026)

Join the community: 1,700+ builders sharing configs at [Discord](https://discord.gg/8pRpHETxa4).
```

Pedir consent por DM antes de publicar con nombres reales.

### H4. Stars desync /sobre-mi
**Score impact:** +1 content trust (→ 89)
**Effort:** 15 min (fix) + añadir CI check
**Bug:** subtitle `/sobre-mi` dice "36.2K+", bio párrafo dice "37.6K+".

**Fix:** el auto-update pipeline tocó uno no el otro. Verificar qué string patterns trackea el sweep en `scripts/update-github-stats.ts` y extender para cubrir subtitle `/sobre-mi` + `/about`.

**CI check:** añadir test que fail si hay múltiples representaciones distintas de stars en el mismo dominio.

---

## Medium
*Optimization, this month.*

### M1. FAQPage /about server-side
**Score impact:** +1 schema (→ 95)
**Effort:** 20 min
**Fix:** mover el FAQPage JSON-LD de `useEffect` a `dangerouslySetInnerHTML` en el render initial. LLMs conservadores (Perplexity browse, ChatGPT-Browse) no ejecutan JS de forma consistente.

### M2. Sitemap lastmod git-derived para articles
**Score impact:** +1 sitemap (→ 97) + +1 trust signal (dateModified coherence)
**Effort:** 30 min
**Files:** `scripts/generate-sitemap.ts` + `src/articles/registry.ts` o `seoMeta`.

**Fix:** extender el `lastmodFromGit([...])` helper (ya existe para home + about) a cada artículo, leyendo `git log -1 --format=%cs` del `.tsx` + `.ts` i18n + `seoMeta` del registry.

### M3. Inline 3 authority citations visibles en career-ops-system prose
**Score impact:** +3 content authoritativeness (→ 90)
**Effort:** 20 min
**Action:** convertir 3 de las citations del JSON-LD en anchors visibles en el cuerpo:
- Anthropic Claude Code → inline en arquitectura section
- Wikipedia Multi-Agent System → inline en architecture/why-modes
- Palantir FDE concept → inline en thesis/manifesto section

### M4. Localize manifesto ES
**Score impact:** +1 GEO (→ 95)
**Effort:** 10 min
**Action:** añadir bajo el manifesto EN en `/sobre-mi` y `/career-ops` ES una versión ES traducida:
> "Las empresas usan IA para filtrar candidatos. Yo le di a los candidatos IA para elegir empresas."

La versión EN sigue siendo canonical; ES es contextual aid. No rompe entity-phrase anchor porque sigue apareciendo EN.

### M5. 2 case studies prerender "NOT FOUND"
**Score impact:** +1 content
**Effort:** investigar, 20-30 min
**Bug:** según content audit, `seo-programatico` y `agente-ai-jacobo` ES slugs retornan "NOT FOUND" en el HTML renderizado. Verificar prerender script no los saltó.

---

## Low
*Nice to have.*

### L1. FAQ expansion 12 answers
Pending consciente. Si se decide hacer, mayor ROI es career-ops EN (27w) + n8n-for-pms EN (22w).

### L2. /privacidad + /privacy en sitemap
2 URLs legales live pero fuera del sitemap.

### L3. pSEO 22 imgs sin dimensions
CLS 0.15-0.20 en esa página. Replica del fix DiagramZoom que hicimos para career-ops.

### L4. Publish /chatbot-prompt.txt externally
Actualmente 404. La regla "bot linka career-ops.org first" es internal-only. Publicar abbreviated 150-300 words o append a llms.txt.

### L5. imagesrcset 768w variant career-ops hero
-400ms mobile LCP. Añadir `hero-career-ops-768w.webp`.

### L6. Hero images immutable cache
`/career-ops/hero-*.webp` serve `max-age=0, must-revalidate`. Debería ser `max-age=31536000, immutable` como fonts. Repeat-view LCP penalty ~200 ms.

### L7. Retire "Open Source Builder" del typewriter
GEO audit sugiere retirar para consolidar Applied AI Operator signal. **CONFLICT con SEO recommendation** venture-ops (mantener como rol[0] SSR SEO anchor). Decisión estratégica, no táctica — no ejecutar sin alineación con venture-ops.

---

## Orden recomendado

**Sprint A (1h, +7 score):** H1 + H2 + H4 + M1 + M3 → pasa de 91 a ~96/97

**Sprint B (1.5h, +2 score):** H3 (testimonials con consent DM) + M2 + M4 → 97-98

**Sprint C (opcional):** Low-priority backlog cuando time permita.

---

## Decisiones estratégicas pendientes (no tácticas)

1. **L7 Retire Open Source Builder rotation** — requiere alinear con venture-ops. Trade-off SEO anchor vs GEO signal consolidation. No ejecutar unilateralmente.
2. **Manifesto ES localized** vs EN-only canonical — venture-ops ya dijo preservar EN canonical en sesión previa. M4 propone añadir ES como contextual, NO reemplazar. Safe.
