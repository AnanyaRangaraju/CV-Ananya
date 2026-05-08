# Technical SEO Audit v2 — santifer.io

**Fecha:** 2026-04-22
**Baseline v1:** 2026-04-17, score 92/100
**Entorno:** Producción (curl desde CLI)

---

## Resumen ejecutivo

**Technical score: 93/100** (+1 vs baseline)

Los cinco fixes declarados están mayoritariamente verificados en producción. Un regresión menor detectada en `sitemap.xml` (lastmod no refleja git `%cs` para varios artículos) y una contradicción con la claim "LCP preload swap per-article": **todos los artículos siguen preloadeando `foto-avatar-sm.webp`** (hero de home) en lugar del LCP candidate propio. Sin regresiones críticas.

---

## 1. Verificación de fixes declarados

| Fix declarado | Estado | Evidencia |
|---------------|--------|-----------|
| Redirect `/business-os` → `/business-os-para-airtable` 308 | PASS | `HTTP/2 308`, `location: /business-os-para-airtable`, 1 salto, sin cadena |
| DiagramZoom CLS fix | PASS (indirecto) | Sin inline styles hero que cambien post-mount; preload hero image presente con `imagesrcset` + `imagesizes` |
| LCP preload swap per-article | **FAIL** | `agente-ia-jacobo`, `business-os-para-airtable`, `seo-programatico` **todos** preloadean `/foto-avatar-sm.webp` (avatar del home). Debería ser el hero del artículo |
| GridSnakes canvas viewport-gated | PASS (no verificable vía curl) | No aparece en HTML inicial, consistente con lazy init |
| Orphan images cleanup (208 KB) | PASS (no verificable) | No hay 404 en OG images muestreadas |
| Sitemap lastmod via git `%cs` | **PARTIAL FAIL** | Home `2026-04-21` OK (git=2026-04-21). Pero `jacobo` sitemap=`2026-03-07` vs git=`2026-04-18`. `business-os` sitemap=`2026-03-06` vs git=`2026-04-18`. **Varios artículos están stale ~6 semanas** |
| Sin `<priority>` en sitemap | PASS | `grep -c '<priority>' = 0` |

---

## 2. Crawlability

- `robots.txt` 200, Allow `/`, Disallow `/api/`, `/ops` correctos. Bloquea shell del dashboard privado.
- Secciones explícitas para GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended. Consistente con política GEO.
- `Sitemap:` directive presente y apuntando a https + IndexNow key comentado.
- IndexNow key file servido 200 con contenido coincidente: `a538d844-6767-41b9-9028-381ee4b8d567`.
- `llms.txt` 200, UTF-8, bien formado (Manifesto + Contact + métricas actualizadas 37.6K stars).
- Sitemap: 18 `<loc>`, 0 priority, 130 líneas. Incluye nuevos `/chatbot-que-se-cura-solo` + `/self-healing-chatbot` (200 OK ambos).

## 3. Indexability

- Canonicales self-referential en todas las URLs testadas.
- Hreflang consistente en ES/EN para home, `n8n`, `jacobo`, `business-os` (nuevo slug), `pseo`, `chatbot`, `career-ops`, `irepair`, `sobre-mi/about`.
- **Bug menor hreflang**: en `business-os-for-airtable` el orden es `en, es, x-default` mientras que en `seo-programatico`/`jacobo`/home es `es, en, x-default`. Google tolera cualquier orden pero conviene homogeneizar para consistencia interna.
- OG tags completos (image 1200x630, locale `es_ES` + alternate `en_US`, twitter:card large).
- x-default siempre apunta a ES. Correcto porque el mercado principal es ES.

## 4. Seguridad

Sin cambios, todas las cabeceras anteriores siguen:
- `strict-transport-security: max-age=63072000; includeSubDomains; preload` (HSTS preload)
- `content-security-policy` cubriendo `self` + `vercel.live` + `pusher` + `openai` + `vitals`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(self), geolocation=()` — `microphone=self` correcto para voice mode
- `frame-ancestors 'self'`, `object-src 'none'`, `base-uri 'self'`

## 5. URL structure / redirects

- `/business-os` → 308 → `/business-os-para-airtable` (1 salto, no loop). Perfecto.
- `/api/chat` responde 405 a GET con headers correctos (método bloqueado, pero endpoint vivo).
- `/ops` devuelve 404 al no autenticado (shell privado protegido correctamente).
- Todos los EN slugs responden 200 sin cadenas.

## 6. Mobile

- `<meta viewport>` presente con `width=device-width, initial-scale=1.0`.
- `imagesrcset` + `imagesizes` responsive en preload del avatar.
- No hay inline styles sospechosos en hero post-fix DiagramZoom.

## 7. Core Web Vitals (inspección de fuente)

**Potenciales issues detectados:**
- **LCP (medio):** Artículos preloadean el avatar del home (`foto-avatar-sm.webp`), **no** su propio LCP candidate. Esto provoca preload wasted en rutas article y el LCP real llegará más tarde. **Impacto estimado: +200-400ms LCP en rutas article**.
- **CLS:** preload de fonts con `crossorigin` y `font-display` no inspeccionable vía HTML, pero heurística OK.
- **INP:** chatbot SSE streaming no aparece en initial HTML; bien (diferido). Canvas GridSnakes gated por viewport según claim.
- Peso HTML: home 242 KB, jacobo 309 KB, bos 182 KB. Jacobo es el pesado (probablemente inline JSON-LD extenso + HowTo steps).

## 8. Structured data

- Graph con `@id` correctos, Person/Organization/SoftwareSourceCode/FAQPage.
- Claim verificada: `jobTitle[0] = "Applied AI Operator"` confirmado línea 120.
- `SoftwareSourceCode.url = https://career-ops.org`, `codeRepository = github.com/santifer/career-ops`, `sameAs = [career-ops.org, github, wikidata Q139007988]`. **3 dominios en sameAs confirmado**.
- FAQ bilingüe (4 preguntas ES+EN) embebida.
- Credentials completas (12 Skilljar/Credly).
- `alumniOf` incluye 4 organizaciones.

## 9. JS rendering

- HTML prerender completo con contenido + meta + JSON-LD en el initial response. SSG correcto (Vite prerender).
- Cacheo Vercel agresivo (`x-vercel-cache: HIT`, `age: 53808s` en home, `age: 51233s` en jacobo).
- `last-modified` del home `2026-04-21` coincide con git.

## 10. IndexNow

- Key file servido 200 con contenido correcto.
- Comentario en robots.txt documenta la key para Bing/Yandex/Naver/Seznam.

---

## Issues priorizados

### HIGH
1. **LCP preload mismatch en artículos**: `JacoboAgent`, `BusinessOS`, `ProgrammaticSeo`, `N8nForPMs` y `CareerOps` siguen preloadeando `/foto-avatar-sm.webp`. Cada artículo debería preloadear su propio hero image (OG o hero card). Check `src/main.tsx` prerender loop o plantilla HTML base.

### MEDIUM
2. **Sitemap lastmod stale**: articles muestran `2026-03-06/07` cuando git `%cs` = `2026-04-18`. El generador de sitemap (`scripts/generate-sitemap.*`) probablemente está tomando la fecha del frontmatter/registry en vez de `git log -1 --format=%cs <file>`. Validar y re-deploy.
3. **Hreflang order inconsistency**: normalizar a `es → en → x-default` en todos los HTML head. Bug cosmético pero detectable por crawlers estrictos.

### LOW
4. `dateModified` en JSON-LD de articles (`2026-03-06`, `2026-03-07`) tampoco refleja commits recientes. Mismo origen que issue #2.
5. Peso HTML de `agente-ia-jacobo` (309 KB) — considerar extraer FAQ+HowTo a JSON-LD reducido con `@id` references en vez de duplicar contenido.

---

## Score breakdown

| Categoría | Score | Δ v1 |
|-----------|-------|------|
| Crawlability | 10/10 | = |
| Indexability | 9/10 | = (-1 hreflang order) |
| Seguridad | 10/10 | = |
| URL structure | 10/10 | +1 (redirect 308 nuevo) |
| Mobile | 10/10 | = |
| Core Web Vitals | 8/10 | = (LCP preload mismatch) |
| Structured data | 10/10 | +1 (SoftwareSourceCode split) |
| JS rendering | 10/10 | = |
| Sitemap/IndexNow | 8/10 | -1 (lastmod stale) |
| Observabilidad (llms.txt, headers custom) | 8/10 | = |

**Total: 93/100** (baseline: 92). Δ = +1.

---

## Recomendaciones implementation

```bash
# Verificar origen de sitemap lastmod
grep -rn "lastmod\|%cs\|generate-sitemap" scripts/
# Esperado: usar `git log -1 --format=%cs <article-source>.tsx` (o fallback a registry.ts)

# Per-article preload
# En el prerender loop (main.tsx / vite.config plugin),
# inyectar <link rel="preload"> del hero image del artículo
# antes del preload del avatar.
```
