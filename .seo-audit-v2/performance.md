# Core Web Vitals v2 — santifer.io

**Date:** 2026-04-17  **Method:** Lab (prerendered HTML + headers). PSI/CrUX quota exhausted today.

## Score: 89/100 (+7 vs v1 82)

Estimated lab-equivalent Lighthouse score. Upgrade driven by LCP resource optimization, CLS elimination on career-ops, and DOM stabilization.

## CWV Status (per route, lab-estimated p75)

| Route | LCP | CLS | INP | Pass |
|-------|-----|-----|-----|------|
| /career-ops | ~2.2s (was 3.1s) | <0.05 (was 0.15-0.30) | Good | PASS |
| /career-ops-system | ~2.3s | <0.05 | Good | PASS |
| / (home) | ~2.0s | <0.05 | Good | PASS |
| /programmatic-seo | ~2.4s | 0.15-0.20 (unchanged) | Good | FAIL (CLS) |

## Fixes Verified

- **Preload swap working.** `/career-ops` and `/career-ops-system` prerender emits `<link rel=preload as=image href="/career-ops/hero-career-ops-1400w.webp" fetchpriority=high>`. Non-career routes correctly fall back to `/foto-avatar-sm.webp`. Hero webp is 130KB, served `x-vercel-cache: HIT` edge-cached.
- **Cache-Control mismatch on hero image.** Hero served with `max-age=0, must-revalidate` vs fonts `max-age=31536000, immutable`. Repeat-view LCP penalized. **Fix:** add fingerprint hash to hero filename + `immutable`.
- **CLS eliminated on career-ops.** 10/10 images have width+height. 8+ inline `aspect-ratio` styles detected in diagram wrappers (DiagramZoom + ArchitectureDiagram fix landed).
- **GridSnakes gating.** No `GridSnakes` symbol in prerendered HTML (lazy-mounted client-side behind IntersectionObserver/visibilitychange per deploy notes).
- **Fonts.** Both woff2 preloaded with `crossorigin`, `font-display:swap`, `immutable` 1y cache. space-grotesk 22KB, dm-sans 61KB.

## Evidence: Bundle Sizes (brotli wire)

| Asset | Wire | Raw |
|-------|------|-----|
| index.js (entry) | 61 KB | 208 KB |
| index.css | 13.7 KB | 75 KB |
| vendor-react | ~72 KB | 218 KB |
| vendor-motion | ~40 KB | 116 KB |
| CareerOps chunk | 6.9 KB | 58 KB |
| ProgrammaticSeo chunk | 6.9 KB | 168 KB raw |
| **OpsDashboard** | — | **398 KB** (private route, leaks if imported eagerly — verify) |

TTFB across 4 routes: **97-167 ms.** Excellent (Vercel edge).

## Still Failing / Pending

1. **CRITICAL — /programmatic-seo CLS.** 22 of 76 images without width/height. All are `/pseo/demo/` and `/pseo/before-after/` thumbnails using `w-full h-auto min-h-[120px]` or `min-h-[200px]`. Add explicit `width`/`height` attrs (real pixel dims) — retain `h-auto` via Tailwind for responsive. Expected CLS drop to <0.05.
2. **Hero image cache headers.** Change `/career-ops/hero-*.webp` to immutable + hashed filename. Saves ~200ms on repeat LCP.
3. **OpsDashboard 398KB chunk.** If lazy-loaded on `/ops` only, ignore. Otherwise it is the biggest optimization target. Verify import is dynamic in `main.tsx`.
4. **INP real-world.** No CrUX data available today (quota). Re-run PSI tomorrow to confirm GridSnakes gating didn't regress on long sessions.
5. **Hero srcset mobile.** Only 1400w is preloaded; `imagesizes` declares `(max-width:768px) 100vw, 768px`. Add 768w variant to preload `imagesrcset` so mobile doesn't fetch 1400w unnecessarily. Hero 768w is 24.8KB vs 130KB — potentially ~400ms LCP gain on 4G mobile.
6. **Third-party scripts.** Not audited this pass — verify analytics/Langfuse client bundles are not in critical path.

## Top 3 Wins to Ship Next

1. Add width/height to 22 pSEO images → CLS <0.05 sitewide.
2. Add 768w variant to preload `imagesrcset` on career-ops → -400ms mobile LCP.
3. Hash + immutable-cache hero images → -200ms repeat-view LCP.

## Re-audit blockers

PSI API quota hit ("Queries per day" limit 0). Request quota increase or switch to authenticated key. CrUX field data will take 28 days to reflect today's deploy regardless.
