/**
 * Generates the home OG image (public/og-image.webp, 1200x630) from scripts/og-template.html.
 *
 * - Renders the HTML with Playwright (Chromium) → PNG → webp via cwebp. Replicates the hero
 *   design tokens 1:1 (no AI-generated art).
 * - Only regenerates when the template or source assets are newer than the committed webp.
 * - Graceful skip when Chromium isn't available (e.g. Vercel CI) — the committed webp is served as-is.
 *
 * Usage: npx tsx scripts/generate-og-image.ts
 */

import { readFileSync, writeFileSync, existsSync, statSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TEMPLATE = join(__dirname, 'og-template.html')
const OUT_WEBP = join(ROOT, 'public', 'og-image.webp')

async function main() {
  console.log('🖼  Generating OG image...\n')

  // Skip if the committed image is already newer than the template (nothing changed).
  if (existsSync(OUT_WEBP) && statSync(OUT_WEBP).mtimeMs >= statSync(TEMPLATE).mtimeMs) {
    console.log('  ⏭ No change — og-image.webp is current')
    return
  }

  // Resolve template with runtime file:// asset paths.
  const fontDisplay = 'file://' + join(ROOT, 'public', 'fonts', 'fraunces-latin.woff2')
  const fontBody = 'file://' + join(ROOT, 'public', 'fonts', 'inter-latin.woff2')
  const avatar = 'file://' + join(ROOT, 'public', 'foto-avatar.png')
  const html = readFileSync(TEMPLATE, 'utf-8')
    .replaceAll('__FONT_DISPLAY__', fontDisplay)
    .replaceAll('__FONT_BODY__', fontBody)
    .replaceAll('__AVATAR__', avatar)

  const tmpHtml = join(tmpdir(), `og-render-${Date.now()}.html`)
  const tmpPng = join(tmpdir(), `og-render-${Date.now()}.png`)
  writeFileSync(tmpHtml, html, 'utf-8')

  // Render with Playwright. Graceful skip if Chromium isn't installed (e.g. CI).
  let chromium: typeof import('playwright').chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.log('  ⏭ Playwright not available — skipping (committed webp will be served)')
    rmSync(tmpHtml, { force: true })
    return
  }

  let browser
  try {
    browser = await chromium.launch()
  } catch (err) {
    console.log(`  ⏭ Chromium unavailable (${(err as Error).message.split('\n')[0]}) — skipping; committed webp served as-is`)
    rmSync(tmpHtml, { force: true })
    return
  }

  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
    await page.goto('file://' + tmpHtml, { waitUntil: 'networkidle' })
    await page.evaluate(() => (document as any).fonts.ready)
    await page.screenshot({ path: tmpPng, type: 'png' })
    await browser.close()
  } catch (err) {
    await browser.close().catch(() => {})
    rmSync(tmpHtml, { force: true })
    throw err
  }

  // PNG -> webp via cwebp (libwebp). Falls back to leaving PNG note if cwebp missing.
  try {
    execFileSync('cwebp', ['-q', '86', tmpPng, '-o', OUT_WEBP], { stdio: 'pipe' })
  } catch (err) {
    console.warn(`  ⚠ cwebp failed (${(err as Error).message.split('\n')[0]}); install libwebp (brew install webp)`)
    rmSync(tmpHtml, { force: true })
    rmSync(tmpPng, { force: true })
    process.exitCode = 1
    return
  }

  rmSync(tmpHtml, { force: true })
  rmSync(tmpPng, { force: true })
  console.log('  ✓ og-image.webp regenerated')
}

main()
