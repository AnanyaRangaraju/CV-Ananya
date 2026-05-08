# Core Web Vitals Performance Audit — santifer.io

**Audit date:** 2026-04-17
**Method:** Static HTML/asset analysis + production HTTP timings (PageSpeed Insights API quota exhausted, CrUX API requires key)
**Pages audited:** `/` (home), `/career-ops`, `/about`

---

## Executive summary

| Metric | Home | /career-ops | /about | Target |
|--------|------|-------------|--------|--------|
| TTFB (measured cold-path) | 103 ms | 101 ms | 125 ms | < 200 ms ✅ |
| HTML transfer (Brotli) | 41 KB | ~27 KB | ~12 KB | < 100 KB ✅ |
| Critical JS on first paint (br) | 189 KB | 189 KB | 189 KB | < 200 KB ✅ |
| Critical CSS (br) | 14 KB | 14 KB | 14 KB | < 50 KB ✅ |
| Inline critical CSS | ~36 KB | ~36 KB | ~36 KB | < 14 KB ⚠️ |
| LCP image preload correct | ✅ avatar | ❌ should be hero | ✅ | - |
| Images missing width/height | 0/20 | 7/11 | 0 | 0 ⚠️ |
| DOM elements | 1,693 | 789 | 349 | < 1,500 ⚠️ home |

**Estimated field performance score (mobile, 4G):** 82–88

Solid foundation: edge-cached Brotli-compressed HTML, self-hosted fonts with preload + `font-display: swap`, inlined critical CSS, lazy-loaded routes, no render-blocking third-party scripts. Three concrete issues are dragging LCP on case studies and creating avoidable CLS.

---

## 1. LCP (Largest Contentful Paint)

### Home `/` — estimated 1.8–2.4 s ✅
- **LCP element:** likely `<h1>` or avatar (6 KB, preloaded with `fetchpriority="high"`, served via `imagesrcset`).
- Correct preload, correct sizes hints, correct format (WebP).
- Avatar file tiny (6 KB small, 16 KB @ 2×). No optimization gain available.
- TTFB 103 ms from Vercel edge cache HIT.

### `/career-ops` — estimated 2.8–3.5 s ⚠️
**Root cause:** the `<head>` preloads the 6 KB *nav* avatar as LCP resource — but the actual LCP on an article page is the hero image `hero-career-ops-1400w.webp` (132 KB brotli) marked with `fetchpriority="high"` on the `<img>` tag.

- Browser allocates LCP bandwidth to the wrong resource first.
- The hero `<img fetchpriority="high">` helps, but without a head preload it only starts loading after HTML parse → not early-discoverable.
- Impact: adds ~400–800 ms to LCP on slow mobile.

**Evidence:**
```html
<!-- every prerendered page has this — fine for home, wrong for articles -->
<link rel="preload" href="/foto-avatar-sm.webp" as="image" fetchpriority="high">
```
Copied from `index.html` to all 22 pages in `dist/`.

### `/about` — estimated 1.9–2.5 s ✅
- Smaller page (12 KB HTML, 349 elements).
- Avatar preload is actually correct here.

---

## 2. INP (Interaction to Next Paint) — estimated 120–180 ms ✅

**Interactions analyzed:**

| Interaction | Risk | Assessment |
|-------------|------|------------|
| Typewriter phase transitions | low | `useReducer` with ≤40 ms setTimeout per char. Each dispatch is one state update. Fine. |
| Click-to-skip typewriter | low | Single `abortRef.current?.abort()` + dispatch. Fine. |
| FloatingChat open | low | Component is `lazy()` — first click triggers chunk load (50 KB br). |
| HomeToc scroll tracking | low | Two scroll listeners with `{passive: true}`, only `getBoundingClientRect` work. Safe. |
| GridSnakes canvas | **waste** | `setInterval(tick, 180)` runs forever even when hero is off-screen. Not an INP blocker (canvas ≠ layout) but ~5–8 % continuous main-thread usage. |

**Actionable:** gate GridSnakes with IntersectionObserver — stop ticking when the hero leaves viewport. Reduces battery drain and background CPU, helps INP when users scroll back to hero from long content.

---

## 3. CLS (Cumulative Layout Shift)

### `/career-ops` — estimated 0.15–0.30 ⚠️ (poor risk)

**Root cause:** the `DiagramZoom` component accepts optional `width`/`height` props but renders `<img>` without dimensions if they're not passed. 7 of 11 images on `/career-ops` have no dimensions — only a `min-h-[200px]` CSS hack that reserves 200 px but the actual images are 900–1,000 px tall → layout jumps by ~700–800 px per image as it loads below the fold during scroll.

**Offenders by component:**
| File | DiagramZoom calls missing dimensions |
|------|--------------------------------------|
| `src/CareerOps.tsx` | 7 / 7 |
| `src/SelfHealingChatbot.tsx` | 3 / 3 |
| `src/N8nForPMs.tsx` | 2 / 2 |
| `src/JacoboAgent.tsx` | 0 / 25 ✅ |
| `src/BusinessOS.tsx` | 0 / 0 ✅ |
| `src/ProgrammaticSeo.tsx` | 0 / 13 ✅ |
| `src/SantiferIRepair.tsx` | 0 / 0 ✅ |

Jacobo/ProgrammaticSeo are the template for how it should be done — copy their pattern.

**Fix (preferred):** make `width`/`height` required in `DiagramZoomProps`, force TS error for missing ones, and set `aspect-ratio` CSS from props:
```tsx
export function DiagramZoom({ src, hdSrc, alt, caption, loading = 'lazy',
  width, height, hdWidth, hdHeight, className, editorId }: DiagramZoomProps) {
  // ...
  <img src={src} alt={alt} width={width} height={height}
       style={{ aspectRatio: `${width}/${height}` }}
       className="w-full h-auto bg-card" loading={loading} decoding="async" />
```

Alternative quick fix: change `min-h-[200px]` → `aspect-[3/2]` (or measured) in the default class so at least reserved space matches typical screenshot ratio.

### Home, /about — estimated < 0.05 ✅
All 20 images on home have width/height attrs.

---

## 4. FCP (First Contentful Paint) — estimated 0.9–1.3 s ✅

Prerendered HTML + inlined critical CSS + Brotli + edge cache = excellent FCP. One nit: the inlined critical CSS is **~36 KB** (`<style>...</style>` in head). Google's advice is keep first packet ≤ 14 KB for TCP slow-start. Critters is likely inlining the full Tailwind variable registry.

**Action:** inspect the critical-CSS extractor config (it's `data-critters-container` → `beasties`/`critters` Vite plugin). Either tighten which selectors count as "critical" or move theme tokens behind a non-critical layer.

---

## 5. TTFB ✅ (all pages < 130 ms)

Vercel edge (`cdg1`) cache HIT, Brotli compression, proper `cache-control: public, max-age=0, must-revalidate` + ETag revalidation. Nothing to improve.

---

## 6. Resource budget

### JavaScript (critical path, Brotli on wire)
| File | Size |
|------|------|
| `index-*.js` (app shell) | 62 KB |
| `vendor-react-*.js` | 73 KB |
| `vendor-router-*.js` | 13 KB |
| `vendor-motion-*.js` | 41 KB |
| **Total initial JS** | **189 KB br** (645 KB raw) |

### Lazy chunks (loaded on demand)
| Chunk | Size (raw / br) |
|-------|-----------------|
| `FloatingChat` | 152 KB / 50 KB |
| `OpsDashboard` | 408 KB / 119 KB (not reachable from home) |
| `JacoboAgent` | 204 KB / ~65 KB |
| `ProgrammaticSeo` | 171 KB / 55 KB |
| `BusinessOS` | 101 KB / ~33 KB |
| `SelfHealingChatbot` | 78 KB / 26 KB |
| `CareerOps` | 60 KB / 20 KB |

**Observation:** `vendor-motion` is 41 KB br and pulled on the critical path, but Motion (Framer Motion) is only used for the `HomeToc` animated dots and a few `AnimatePresence` wrappers. If you can replace those with CSS transitions or plain transitions, you could save 40 KB br from the initial bundle. Low priority if home LCP is fine.

### Images
- 20 images ≥ 200 KB raw in `dist/` (mostly screenshots in `pseo/`, `jacobo/`, `career-ops/`).
- Largest: `pseo/ss-repair-page-full.webp` 346 KB, `pseo/ss-airtable-repair-fields-hd.webp` 329 KB.
- Already WebP. AVIF conversion would save ~25–35 % but screenshots compress well in WebP already.
- All article images are `loading="lazy"` — only hero is eager. Correct.

---

## 7. Fonts ✅

- Self-hosted in `/fonts/` (eliminates Google Fonts CDN hop).
- Two critical subsets preloaded: `space-grotesk-latin.woff2` (22 KB), `dm-sans-latin.woff2` (62 KB).
- `font-display: swap` on all faces.
- Brotli-compressed at rest (served with `cache-control: public, max-age=31536000, immutable`).
- DM Sans `latin.woff2` at 62 KB is on the larger side — consider subsetting to only needed weights (400/500/600) if all 4 are loaded.

**Check:** `ls dist/fonts/` shows both latin and latin-ext for each family. Latin-ext (for diacritics/some accents) is not preloaded — good, it's used via unicode-range.

---

## 8. Third-party scripts

**None on initial render.** FloatingChat is lazy, Langfuse runs server-side in `/api/chat`, Anthropic SDK runs on edge. This is excellent.

Only external endpoints touched at runtime after user interaction:
- `/api/chat` (same-origin, edge)
- Mux player iframe on `/career-ops` (lazy via `{ready && <iframe>}`)
- YouTube iframes in some articles (lazy)

---

## Top 3 optimizations (prioritized by impact)

### 1. Fix LCP preload on article pages (HIGH impact)
Per-page preload inject during prerender. For case study pages, preload the hero image instead of the nav avatar.

**Where:** `scripts/prerender.tsx`. After rendering, for pages with `registry.type === 'case-study'` (or detect hero img element), replace the generic preload with a page-specific one.

```tsx
// Pseudo
const heroMatch = html.match(/<img[^>]*fetchpriority="high"[^>]*src="([^"]+)"/);
if (heroMatch) {
  html = html.replace(
    /<link rel="preload" href="\/foto-avatar-sm\.webp"[^>]*>/,
    `<link rel="preload" href="${heroMatch[1]}" as="image" type="image/webp" fetchpriority="high">`
  );
}
```

**Expected LCP improvement on case studies:** 400–800 ms on mobile.

### 2. Fix CLS on article pages (HIGH impact)
Make `DiagramZoom` dimensions required and add `aspect-ratio` CSS. Backfill missing dimensions on the 12 offending calls in `CareerOps.tsx`, `SelfHealingChatbot.tsx`, `N8nForPMs.tsx`.

**Steps:**
1. In `src/articles/content-types.tsx` change interface to required `width: number; height: number`.
2. Add `style={{ aspectRatio: \`${width}/${height}\` }}` to the `<img>`.
3. Run `npm run build` — TS errors will flag every missing caller.
4. For each flagged file, get the natural dimensions (e.g. `identify` or file metadata) and pass them.

**Expected CLS improvement on /career-ops:** 0.20 → < 0.05.

### 3. Gate GridSnakes animation to hero visibility (LOW–MED impact)
Wrap the `setInterval` tick in an IntersectionObserver — pause when hero leaves viewport and on `document.visibilityState === 'hidden'`.

```tsx
useEffect(() => {
  // ...existing
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !document.hidden) {
      if (!intervalRef.current) intervalRef.current = setInterval(tick, TICK_MS);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
  }, { threshold: 0 });
  if (parent) io.observe(parent);
  const onVis = () => { /* same logic */ };
  document.addEventListener('visibilitychange', onVis);
  // ...
}, []);
```

Reduces background CPU to 0 on scroll and in inactive tabs. Minor INP/battery win.

---

## Nice-to-haves (low priority)

1. **Reduce inline critical CSS from 36 KB to ~14 KB.** Likely Tailwind theme registry is being included as critical. Investigate beasties/critters config.
2. **Consider AVIF versions** of the 10 largest screenshots (> 200 KB). Saves 25–35 %.
3. **Subset DM Sans** if only 400/500/600 weights are used. Current `dm-sans-latin.woff2` is 62 KB — probably includes unused weights.
4. **DOM size on home 1693 elements** — not critical (< 2000) but drift to watch.
5. **Consider removing Motion** if only used for dot transitions (40 KB br on critical path). CSS transitions can replicate.

---

## What's already excellent

- Vercel edge cache with HTML HIT → TTFB ~100 ms
- Brotli compression everywhere (HTML, JS, CSS, fonts)
- Self-hosted fonts with preload + `font-display: swap`
- Inlined critical CSS + async main stylesheet + `<noscript>` fallback
- Route-level code splitting (React.lazy) for all articles
- FloatingChat and heavy components lazy-loaded
- No third-party JS on critical path
- Images in WebP with srcset/sizes on hero
- Proper immutable caching on fingerprinted assets
- `<html lang>` set, dark color-scheme declared
- Jacobo and ProgrammaticSeo articles already pass all dimension checks → template to follow

---

## Performance score estimate

Based on static analysis (field data unavailable due to API quota):

| Page | Estimated Lighthouse Performance |
|------|----------------------------------|
| `/` (home) | **88–92** |
| `/career-ops` | **76–82** (LCP preload miss + CLS) |
| `/about` | **90–94** |

After implementing top 3 fixes: all pages should land in 92–96.
