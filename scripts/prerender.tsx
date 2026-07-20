/**
 * Post-build script: SSR prerender using React's renderToString.
 *
 * Renders the actual App component to HTML so the pre-rendered content
 * matches exactly what React produces. This enables hydrateRoot() on the
 * client to adopt the existing DOM without replacing it (zero CLS).
 *
 * Articles are loaded from the article registry. Only articles whose
 * component files exist will be prerendered (new case studies added to the
 * registry but not yet created will be skipped gracefully).
 *
 * Usage: npx tsx scripts/prerender.tsx  (runs automatically via "npm run build")
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import React, { Suspense, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import Critters from 'critters';
import App from '../src/App.tsx';
import GlobalNav from '../src/GlobalNav.tsx';
import { articleRegistry, type ArticleConfig } from '../src/articles/registry.ts';
import { buildArticleJsonLd, buildFaqPage } from '../src/articles/json-ld.ts';
import AboutPage from '../src/AboutPage.tsx';
import { aboutContent } from '../src/about-i18n.ts';
import PrivacyPolicy from '../src/PrivacyPolicy.tsx';
import { seo } from '../src/i18n.ts';

// Map article id → i18n content for JSON-LD generation.
// Empty for now: no case-study articles are registered. Add entries here
// alongside new articleRegistry entries in src/articles/registry.ts.
const i18nMap: Record<string, { header: { h1: string }; nav: { breadcrumbHome: string; breadcrumbCurrent: string }; faq: { items: readonly { q: string; a: string }[] } }> = {};

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/** Strip React 19 SSR-injected <link> tags from inside #root to prevent hydration mismatch */
function stripReactSSRTags(html: string): string {
  return html.replace(/<link[^>]*>/g, '');
}

// ---------------------------------------------------------------------------
// SSR render (home page)
// ---------------------------------------------------------------------------
function renderApp(path: '/' | '/en'): string {
  return stripReactSSRTags(renderToString(
    <StaticRouter location={path}>
      <div>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/en" element={<App />} />
          </Routes>
        </Suspense>
      </div>
    </StaticRouter>
  ));
}

function renderArticlePage(slug: string, ArticleComponent: ComponentType<{ lang: 'en' }>): string {
  return stripReactSSRTags(renderToString(
    <StaticRouter location={`/${slug}`}>
      <GlobalNav />
      <div>
        <Suspense fallback={null}>
          <Routes>
            <Route path={`/${slug}`} element={<ArticleComponent lang="en" />} />
          </Routes>
        </Suspense>
      </div>
    </StaticRouter>
  ));
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Inject into built HTML
// ---------------------------------------------------------------------------
const distDir = resolve(root, 'dist');
const indexPath = resolve(distDir, 'index.html');

let indexHtml: string;
try {
  indexHtml = readFileSync(indexPath, 'utf-8');
} catch {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

// --- Home page (rendered once, written to both / and /en) ---
let homeHtml: string;
try {
  homeHtml = renderApp('/');
} catch (err) {
  console.error('[prerender] SSR failed for home, falling back to empty root:', err);
  homeHtml = '';
}

const homeSeo = seo.en;

const rootPage = indexHtml
  .replace('<div id="root"></div>', `<div id="root">${homeHtml}</div>`)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(homeSeo.title)}</title>`)
  .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(homeSeo.title)}" />`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(homeSeo.description)}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(homeSeo.title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(homeSeo.description)}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(homeSeo.title)}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(homeSeo.description)}" />`);

let enHtml: string;
try {
  enHtml = renderApp('/en');
} catch (err) {
  console.error('[prerender] SSR failed for /en, falling back to empty root:', err);
  enHtml = '';
}

// /en is a duplicate of the home page — canonicalize back to / to avoid split signals.
const enPage = rootPage
  .replace('<div id="root">' + homeHtml + '</div>', `<div id="root">${enHtml}</div>`)
  .replace(/<link rel="canonical" href="[^"]*" \/>/, '<link rel="canonical" href="https://ananyarangaraju.com/" />')
  .replace(/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="https://ananyarangaraju.com/" />')
  .replace(/<meta name="twitter:url" content="[^"]*" \/>/, '<meta name="twitter:url" content="https://ananyarangaraju.com/" />');

// ---------------------------------------------------------------------------
// About page — /about
// ---------------------------------------------------------------------------

const aboutPersonProfile = {
  '@type': 'ProfilePage',
  dateModified: '2026-07-19',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://ananyarangaraju.com/#person',
    name: 'Ananya Rangaraju',
    url: 'https://ananyarangaraju.com',
    image: 'https://ananyarangaraju.com/foto-avatar.png',
    email: 'ananya.rangaraju@gmail.com',
    description: 'Ananya Rangaraju is a software developer and AI systems engineer who completed a Master of Engineering Management at Dartmouth College. She spent two years as a Software Developer at Oracle Health (formerly Cerner), where she owned observability for clinical AI agents deployed across 100+ client sites and 1M+ monthly interactions.',
    jobTitle: ['AI Systems & Product Engineer', 'Software Developer'],
    knowsAbout: [
      'Agentic Workflows', 'LLM Prompt Engineering', 'Tool-Calling Integrations', 'RAG Pipeline Architecture',
      'Multi-Model Benchmarking', 'Agent Observability', 'AI Governance', 'LLMOps',
      'Next.js', 'FastAPI', 'TypeScript', 'Python', 'REST APIs', 'PostgreSQL',
      'SQL', 'Pandas', 'NumPy', 'scikit-learn', 'AWS', 'Snowflake', 'Kubernetes', 'Git',
      'Power BI', 'Tableau', 'JIRA', 'UAT', 'SLA Monitoring', 'Rapid Prototyping',
    ],
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Dartmouth College', description: 'Master of Engineering Management (2024-2026)' },
      { '@type': 'EducationalOrganization', name: 'Manipal University Jaipur', description: 'B.Tech, Computer Science & Engineering (2018-2022), CGPA 3.9/4.0' },
    ],
    sameAs: [
      'https://github.com/AnanyaRangaraju',
      'https://www.linkedin.com/in/ananya-rangaraju/',
    ],
    address: { '@type': 'PostalAddress', addressLocality: 'Hanover', addressRegion: 'NH', addressCountry: 'US' },
  },
};

/**
 * Build the @graph for /about. Includes ProfilePage + FAQPage so AI crawlers
 * see FAQ schema in SSR'd HTML (no longer requires JS execution / useEffect).
 */
function buildAboutJsonLd(pageUrl: string, faq: readonly { q: string; a: string }[]) {
  // Split: ProfilePage references Person by @id (not inline) so KG crawlers
  // dedupe cleanly against the canonical Person emitted on home and articles.
  // The Person itself is emitted top-level in this @graph for ID resolution
  // when /about is the canonical entity home crawled in isolation.
  const personFull = aboutPersonProfile.mainEntity;
  const profile = {
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#profilepage`,
    dateModified: aboutPersonProfile.dateModified,
    inLanguage: 'en',
    mainEntity: { '@id': 'https://ananyarangaraju.com/#person' },
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [profile, personFull, buildFaqPage(faq, pageUrl, 'en')],
  };
}

const t = aboutContent.en;
const aboutSlug = t.slug;
const aboutUrl = `https://ananyarangaraju.com/${aboutSlug}`;

let aboutRenderedHtml: string;
try {
  aboutRenderedHtml = stripReactSSRTags(renderToString(
    <StaticRouter location={`/${aboutSlug}`}>
      <GlobalNav />
      <div>
        <Suspense fallback={null}>
          <Routes>
            <Route path={`/${aboutSlug}`} element={<AboutPage lang="en" />} />
          </Routes>
        </Suspense>
      </div>
    </StaticRouter>
  ));
} catch (err) {
  console.error(`[prerender] SSR failed for ${aboutSlug}, falling back to empty root:`, err);
  aboutRenderedHtml = '';
}

let aboutPage = indexHtml
  .replace('<div id="root"></div>', `<div id="root">${aboutRenderedHtml}</div>`)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(t.seo.title)}</title>`)
  .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(t.seo.title)}" />`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(t.seo.description)}" />`)
  .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, '')
  .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${aboutUrl}" />`)
  .replace(/<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="profile" />')
  .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${aboutUrl}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(t.seo.title)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(t.seo.description)}" />`)
  .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${aboutUrl}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(t.seo.title)}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(t.seo.description)}" />`);

// Build @graph (ProfilePage + FAQPage) and inject as SSR JSON-LD
const aboutJsonLd = buildAboutJsonLd(aboutUrl, t.faq);
const aboutJsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(aboutJsonLd, null, 2)}\n</script>`;

// Replace homepage JSON-LD with ProfilePage + FAQPage @graph
aboutPage = aboutPage.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  aboutJsonLdScript,
);

// ---------------------------------------------------------------------------
// Article pages — build from registry
// ---------------------------------------------------------------------------
interface ArticlePage {
  slug: string;
  html: string;
}

function buildArticlePage(
  config: ArticleConfig,
  ArticleComponent: ComponentType<{ lang: 'en' }>,
): string {
  const slug = config.slugs.en;
  const url = `https://ananyarangaraju.com/${slug}`;
  const articleSeo = config.seo.en;

  let renderedHtml: string;
  try {
    renderedHtml = renderArticlePage(slug, ArticleComponent);
  } catch (err) {
    console.error(`[prerender] SSR failed for ${slug}, falling back to empty root:`, err);
    renderedHtml = '';
  }

  let result = indexHtml
    .replace('<div id="root"></div>', `<div id="root">${renderedHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(articleSeo.title)}</title>`)
    .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(articleSeo.description)}" />`)
    // Remove home hreflang tags before injecting article-specific ones
    .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, '')
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="article" />')
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(articleSeo.description)}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(articleSeo.description)}" />`)
    // OG image — replace with article-specific image if configured
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(config.ogImage || 'https://ananyarangaraju.com/og-image.webp')}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(articleSeo.title)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, config.ogImage ? `<meta name="twitter:image" content="${esc(config.ogImage)}" />` : '');

  // Inject article:published_time + article:modified_time + article:tag
  const seoMeta = config.seoMeta;
  if (seoMeta) {
    const articleMetaTags = [
      `<meta property="article:published_time" content="${seoMeta.datePublished}" />`,
      `<meta property="article:modified_time" content="${seoMeta.dateModified}" />`,
      `<meta property="article:author" content="https://github.com/AnanyaRangaraju" />`,
      `<meta property="article:tag" content="${esc(seoMeta.articleTags)}" />`,
    ].join('\n    ');
    result = result.replace('</head>', `    ${articleMetaTags}\n  </head>`);
  }

  // Inject article JSON-LD (replace homepage Person/WebSite schema)
  const i18n = i18nMap[config.id];
  if (seoMeta && i18n) {
    const jsonLd = buildArticleJsonLd({
      lang: 'en',
      url: `https://ananyarangaraju.com/${slug}`,
      headline: i18n.header.h1,
      alternativeHeadline: articleSeo.title,
      description: articleSeo.description,
      datePublished: seoMeta.datePublished,
      dateModified: seoMeta.dateModified,
      keywords: seoMeta.keywords,
      images: config.heroImage ? [config.heroImage] : seoMeta.images,
      breadcrumbHome: i18n.nav.breadcrumbHome,
      breadcrumbCurrent: i18n.nav.breadcrumbCurrent,
      faq: i18n.faq.items,
      articleType: seoMeta.articleType,
      about: seoMeta.about,
      extra: seoMeta.extra,
      citation: seoMeta.citation,
      isBasedOn: seoMeta.isBasedOn,
      mentions: seoMeta.mentions,
      discussionUrl: seoMeta.discussionUrl,
      relatedLink: seoMeta.relatedLink,
      video: seoMeta.video,
      subjectOf: seoMeta.subjectOf,
    });
    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
    // Replace the homepage JSON-LD with article-specific one
    result = result.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      jsonLdScript,
    );
  }

  return result;
}

// Load article components and build pages
const articlePages: ArticlePage[] = [];

for (const config of articleRegistry) {
  let ArticleComponent: ComponentType<{ lang: 'en' }>;
  try {
    const mod = await config.component();
    ArticleComponent = mod.default;
  } catch {
    console.log(`[prerender] Skipping ${config.id} — component not found yet`);
    continue;
  }

  const html = buildArticlePage(config, ArticleComponent);
  articlePages.push({ slug: config.slugs.en, html });
}

// ---------------------------------------------------------------------------
// Critical CSS inlining with Critters
// ---------------------------------------------------------------------------
const critters = new Critters({
  path: distDir,
  publicPath: '/',
  inlineFonts: false,
  preload: 'media',
  compress: true,
  reduceInlineStyles: true,
});

function dedupePreloads(html: string): string {
  return html.replace(/<link rel="preload" as="image" href="\/foto-avatar\.webp">/g, '');
}

/**
 * Swap the base <link rel="preload"> for the avatar (home LCP) to the
 * article's hero image (article LCP). Detects `<img ... fetchpriority="high" ...>`
 * in the rendered content and rewrites the preload to match, preserving srcset
 * and sizes where available. If no high-priority image found, leave as-is.
 */
function swapLcpPreload(html: string, isArticle: boolean): string {
  if (!isArticle) return html;
  const imgMatch = html.match(/<img[^>]*fetchpriority="high"[^>]*>/i);
  if (!imgMatch) return html;
  const img = imgMatch[0];
  const src = img.match(/\bsrc="([^"]+)"/)?.[1];
  if (!src) return html;
  const srcset = img.match(/\bsrcset="([^"]+)"/)?.[1];
  const sizes = img.match(/\bsizes="([^"]+)"/)?.[1];
  const attrs = [
    `rel="preload"`,
    `as="image"`,
    `href="${src}"`,
    `type="image/webp"`,
    srcset ? `imagesrcset="${srcset}"` : '',
    sizes ? `imagesizes="${sizes}"` : '',
    `fetchpriority="high"`,
  ].filter(Boolean).join(' ');
  const newPreload = `<link ${attrs} />`;
  return html.replace(
    /<link rel="preload" href="\/foto-avatar-sm\.webp"[^>]*>/,
    newPreload,
  );
}

async function writePage(html: string, outputPath: string, label: string) {
  const dir = dirname(outputPath);
  mkdirSync(dir, { recursive: true });
  // Article pages live in dist/<slug>/index.html, NOT dist/index.html or dist/en/index.html
  const isArticle = /\/dist\/[^/]+\/index\.html$/.test(outputPath)
    && !/\/dist\/(en|privacy)\/index\.html$/.test(outputPath);
  const pre = swapLcpPreload(html, isArticle);
  try {
    const processed = dedupePreloads(await critters.process(pre));
    writeFileSync(outputPath, processed, 'utf-8');
    console.log(`[prerender] ${label} (with critical CSS)`);
  } catch {
    writeFileSync(outputPath, pre, 'utf-8');
    console.log(`[prerender] ${label} (no critical CSS)`);
  }
}

// ---------------------------------------------------------------------------
// Privacy page — /privacy
// ---------------------------------------------------------------------------
const privacySlug = 'privacy';
const privacyUrl = `https://ananyarangaraju.com/${privacySlug}`;
const privacyTitle = 'Privacy Policy | ananyarangaraju.com';
const privacyDescription = 'Privacy policy for ananyarangaraju.com. How chatbot and website data is collected and used.';

let privacyRenderedHtml: string;
try {
  privacyRenderedHtml = stripReactSSRTags(renderToString(
    <StaticRouter location={`/${privacySlug}`}>
      <GlobalNav />
      <div>
        <Suspense fallback={null}>
          <Routes>
            <Route path={`/${privacySlug}`} element={<PrivacyPolicy lang="en" />} />
          </Routes>
        </Suspense>
      </div>
    </StaticRouter>
  ));
} catch (err) {
  console.error(`[prerender] SSR failed for ${privacySlug}:`, err);
  privacyRenderedHtml = '';
}

let privacyPage = indexHtml
  .replace('<div id="root"></div>', `<div id="root">${privacyRenderedHtml}</div>`)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(privacyTitle)}</title>`)
  .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(privacyTitle)}" />`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(privacyDescription)}" />`)
  .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, '')
  .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${privacyUrl}" />`)
  .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${privacyUrl}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(privacyTitle)}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(privacyDescription)}" />`)
  .replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${privacyUrl}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(privacyTitle)}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(privacyDescription)}" />`);

// Remove homepage JSON-LD (privacy page doesn't need structured data)
privacyPage = privacyPage.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');

async function inlineCriticalCSS() {
  // Home pages
  await writePage(rootPage, indexPath, 'Home: dist/index.html updated');
  await writePage(enPage, resolve(distDir, 'en', 'index.html'), 'EN: dist/en/index.html created');

  // About page
  await writePage(aboutPage, resolve(distDir, aboutSlug, 'index.html'), `${aboutSlug}: dist/${aboutSlug}/index.html created`);

  // Article pages
  for (const { slug, html } of articlePages) {
    await writePage(html, resolve(distDir, slug, 'index.html'), `${slug}: dist/${slug}/index.html created`);
  }

  // Privacy page
  await writePage(privacyPage, resolve(distDir, privacySlug, 'index.html'), `${privacySlug}: dist/${privacySlug}/index.html created`);
}

await inlineCriticalCSS();

// ---------------------------------------------------------------------------
// 404 page — Vercel serves this with HTTP 404 status automatically
// ---------------------------------------------------------------------------
const notFoundHtml = indexHtml
  .replace('<div id="root"></div>', `<div id="root"><div style="min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 1.5rem"><p style="font-size:6rem;font-weight:bold;color:var(--primary);margin-bottom:1rem;font-family:var(--font-display)">404</p><h1 style="font-size:1.5rem;font-weight:600;color:var(--foreground);margin-bottom:0.5rem">Page not found</h1><p style="color:var(--muted-foreground);margin-bottom:2rem;max-width:28rem">The page you're looking for doesn't exist or has been moved.</p><a href="/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;background:var(--primary);color:var(--primary-foreground);font-weight:500;text-decoration:none">← Back to home</a></div></div>`)
  .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/<title>[^<]*<\/title>/, '<title>404 — Page not found | ananyarangaraju.com</title>');

// Add noindex if no robots meta exists
if (!notFoundHtml.includes('name="robots"')) {
  const withNoindex = notFoundHtml.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
  writeFileSync(resolve(distDir, '404.html'), withNoindex, 'utf-8');
} else {
  writeFileSync(resolve(distDir, '404.html'), notFoundHtml, 'utf-8');
}
console.log('[prerender] 404: dist/404.html created');

// ---------------------------------------------------------------------------
// Hydration structure validation
// ---------------------------------------------------------------------------
function validateHydrationStructure(html: string, label: string) {
  const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
  if (!rootMatch || !rootMatch[1].trim()) return; // empty root = OK (fallback)
  const content = rootMatch[1];

  // Must NOT contain <link> tags (React 19 SSR artifacts)
  if (/<link\s/.test(content)) {
    console.error(`[hydration-check] FAIL ${label}: <link> tags found inside #root — will cause hydration mismatch`);
    process.exit(1);
  }

  // Must have <div> wrapper (PageTransition)
  if (!content.includes('<div')) {
    console.error(`[hydration-check] FAIL ${label}: missing <div> wrapper (PageTransition) inside #root`);
    process.exit(1);
  }
}

// Validate home pages
validateHydrationStructure(rootPage, 'home');
validateHydrationStructure(enPage, 'home-en');

// Validate about page
validateHydrationStructure(aboutPage, aboutSlug);

// Validate article pages
for (const { slug, html } of articlePages) {
  validateHydrationStructure(html, slug);
}

// Validate privacy page
validateHydrationStructure(privacyPage, privacySlug);

console.log('[hydration-check] All pages pass structural validation');
console.log('[prerender] Done.');
