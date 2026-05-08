# Schema.org Audit — santifer.io (LIVE)

Generated: 2026-04-17
Pages audited: 15 (home ES/EN, about/sobre-mi, 10 article slugs + EN variants)
Total JSON-LD blocks parsed: 15 (1 per page, all `@graph` or standalone)

## Schema Score: 92 / 100

Break-down:
- Validation: 20/20 (no parse errors, no missing required props, no bad dates)
- Consistency: 20/20 (Person sameAs identical across 13 pages = 16 URLs each)
- Coverage: 15/20 (Organization + VideoObject absent; career-ops well-covered)
- AI-friendly (mentions/citation/about/isBasedOn): 20/20 (exemplary)
- Freshness (YYYY-MM-DD dateModified): 10/10 (zero ISO datetime violations)
- Ranking opportunities: 7/10 (Review/AggregateRating and Organization could unlock more)

## 1. Validation

All 15 pages parse as valid JSON. Zero errors.

Required props check — all passed:
- Article/TechArticle: headline, datePublished, author, image present on all 10 articles
- FAQPage: mainEntity present (home has 20 Q&As; each article has its own FAQ block)
- BreadcrumbList: itemListElement present on all articles

Date format (must be YYYY-MM-DD):
- 0 violations. All `datePublished` and `dateModified` values match `^\d{4}-\d{2}-\d{2}$`.

Deprecated types check:
- 0 uses of HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, LearningVideo.
- FAQPage used on commercial site → Info-level flag only. Existing FAQPage helps AI citation (LLMs parse it), even without Google rich results.

## 2. Consistency (Person sameAs)

Reference set: 16 URLs on home.
All 13 pages with Person: identical 16-URL sameAs.
Pages without Person: sf_about, sf_sobre-mi (use `ProfilePage > mainEntity: Person` where Person is fully embedded with its own sameAs — also 16 URLs, consistent).

Conclusion: entity graph is perfectly aligned across the site. Wikidata Q138710224 appears on every Person block.

## 3. Coverage

Current types in use:
| Type | Where |
|------|-------|
| ProfilePage | home, /en, /about, /sobre-mi, /business-os, /business-os-para-airtable (wrapper) |
| Person | all pages |
| WebSite | all pages |
| FAQPage | all pages (home: 20 Q&As; articles: 4-8 each) |
| TechArticle | all case studies + career-ops |
| BreadcrumbList | all articles |
| SoftwareSourceCode | career-ops (nested in mentions) with license MIT + offers $0 + Wikidata sameAs + discussionUrl |
| SoftwareApplication | career-ops, jacobo, chatbot-que-se-cura-solo (nested) |

Missing opportunities:
1. **Organization (top-level)** — Santifer iRepair is referenced inside `founder` but not as a standalone Organization node with address, logo, foundingDate, areaServed.
2. **SoftwareApplication (top-level for Jacobo / Claude Pulse / Content Digest)** — currently only nested inside `mentions`. Promoting to sibling in `@graph` would unlock SoftwareApp rich results.
3. **Review / AggregateRating** — career-ops has 2600+ Reddit upvotes, 28K GitHub stars. Currently cited as DiscussionForumPosting. A synthetic `AggregateRating` on the SoftwareSourceCode is NOT advised (no structured review system), but individual `Review` items from named sources (HDVMA.fr, etc.) are possible.
4. **VideoObject** — not needed. Zero YouTube embeds detected on audited pages.
5. **Service / Offer (for consulting)** — if Santiago offers consulting, a `Service` node on home unlocks visibility.

## 4. AI-friendly fields

Excellent coverage. Table:

| Page | mentions | citation | about | isBasedOn | keywords |
|------|----------|----------|-------|-----------|----------|
| agente-ia-jacobo / ai-agent-jacobo | 5 | 3 | 4 | - | 25 |
| business-os-para-airtable | 2 | 1 | 4 | - | 15 |
| career-ops / career-ops-system | 5 | 9 | 4 | - | 20 |
| chatbot-que-se-cura-solo | 5 | 3 | 4 | - | 21 |
| n8n-for-pms / n8n-para-pms | 2 | 2 | 2 | 1 | 14 |
| programmatic-seo / seo-programatico | 3 | 1 | 3 | - | 10 |

Observations:
- career-ops has the strongest AI-citation profile: 9 citations including Reddit DiscussionForumPosting, HDVMA blog, Anthropic docs, Playwright docs.
- n8n-for-pms is the only article with `isBasedOn` (original collab with Marily).
- **Gap**: business-os-para-airtable has only 2 mentions + 1 citation. Could add more (Airtable docs, n8n docs, other ERP references).
- **Gap**: programmatic-seo has only 1 citation. Could cite Google's pSEO guidance, Ahrefs case studies, Vercel docs.
- **Gap**: home ProfilePage has zero `mentions`/`citation`/`about`. The Person entity has `knowsAbout` (good) but no `subjectOf` linking to authoritative coverage of Santiago.

## 5. Freshness

Zero violations. All `dateModified` and `datePublished` fields are pure `YYYY-MM-DD`.
Spot-check: career-ops datePublished 2026-03-17, dateModified 2026-04-17.

## 6. Ranking opportunities (prioritized)

### HIGH — Organization top-level node on home/about
Adds Santifer iRepair as first-class entity. Unlocks Knowledge Panel eligibility and local SEO signals (currently Santifer iRepair is only nested in `founder`). Include logo, address, foundingDate, areaServed, sameAs (link to zinkee.com if applicable).

### HIGH — Promote SoftwareApplication to @graph sibling on career-ops
Currently `SoftwareSourceCode` lives inside `TechArticle.mentions`. A top-level `SoftwareApplication` node (with the same properties + aggregateRating synthesized from GitHub stars would be risky, but operatingSystem + applicationCategory + softwareVersion are safe) would make career-ops eligible for SoftwareApp rich results independently of the article.

### MEDIUM — Boost thin `citation[]` on business-os and programmatic-seo
Both articles have strong narratives but <2 citations. Add 3-5 authoritative external refs each (Airtable docs, n8n, Google pSEO guidance, Vercel, etc.). LLMs weight `citation` heavily when deciding whether to quote a source.

### MEDIUM — Add `subjectOf` to Person on home
Link the Person entity to external coverage (podcast appearances, interviews, Reddit thread about career-ops, etc.). Strengthens entity authority for LLM citation.

### LOW — Consider Review items on career-ops
Individual `Review` nodes citing HDVMA.fr, Reddit thread (as `Review.author`), etc. Not AggregateRating (no formal rating system), but `Review.reviewBody` + `author` is valid.

### SKIP
- HowTo (deprecated Sept 2023)
- VideoObject (no video embeds on site)
- FAQPage additions on commercial pages (Google restricted FAQ rich results to gov/health; keep existing for AI benefit, don't add more for SEO).

## Detected types summary

```
sf_about                    ProfilePage
sf_agente-ia-jacobo         TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_ai-agent-jacobo          TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_business-os              WebSite, ProfilePage, Person, FAQPage
sf_business-os-para-airtable TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_career-ops               TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_career-ops-system        TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_chatbot-que-se-cura-solo TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_en                       WebSite, ProfilePage, Person, FAQPage
sf_home                     WebSite, ProfilePage, Person, FAQPage
sf_n8n-for-pms              TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_n8n-para-pms             TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_programmatic-seo         TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_seo-programatico         TechArticle, Person, WebSite, BreadcrumbList, FAQPage
sf_sobre-mi                 ProfilePage
```

Note: `/business-os` canonical uses home-style graph (WebSite+ProfilePage+Person+FAQPage), while `/business-os-para-airtable` uses article-style (TechArticle+Breadcrumb+FAQPage). This is intentional asymmetry — verify which URL you want indexed as canonical.

## Drop-in JSON-LD — HIGH priority additions

### 1. Organization node (add to home @graph)

```json
{
  "@type": "Organization",
  "@id": "https://santifer.io/#organization",
  "name": "Santifer iRepair",
  "url": "https://santifer.io",
  "logo": "https://santifer.io/zinkee-logo.svg",
  "founder": { "@id": "https://santifer.io/#person" },
  "foundingDate": "2016",
  "areaServed": "ES",
  "sameAs": [
    "https://www.linkedin.com/company/santifer-irepair"
  ]
}
```

### 2. Top-level SoftwareApplication (add to career-ops @graph)

```json
{
  "@type": "SoftwareApplication",
  "@id": "https://santifer.io/career-ops#app",
  "name": "career-ops",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "macOS, Linux",
  "url": "https://github.com/santifer/career-ops",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "softwareVersion": "1.0",
  "license": "https://opensource.org/licenses/MIT",
  "sameAs": "https://www.wikidata.org/wiki/Q139007988",
  "author": { "@id": "https://santifer.io/#person" }
}
```

### 3. Boost `citation[]` on business-os-para-airtable (TechArticle)

```json
"citation": [
  { "@type": "WebPage", "name": "Airtable API Reference", "url": "https://airtable.com/developers/web/api/introduction" },
  { "@type": "WebPage", "name": "n8n Workflow Automation Docs", "url": "https://docs.n8n.io/" },
  { "@type": "WebPage", "name": "Anthropic Claude API", "url": "https://docs.anthropic.com/" }
]
```
