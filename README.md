# Ming Shi Academic Homepage — Redesigned Static Site

A responsive, accessible, dependency-free academic website for **Ming Shi**, Assistant Professor at the University at Buffalo. The redesign keeps the supplied biography, research interests, publication record, honors and talks, student mentoring, teaching, outreach, and service, while presenting them through a clearer research narrative.

## What is included

- **`index.html`** — research identity, biography, current metrics, selected publications, impact, honors/talks, and contact.
- **`research.html`** — three connected research thrusts, core questions, representative outputs, systems context, and an original research illustration.
- **`publications.html`** — complete record with live search, type/topic/year/status filters, sorting, PDF/DOI links, and citation-copy buttons.
- **`studentsandteaching.html`** — Ph.D. students, teaching portfolio, mentoring philosophy, and outreach.
- **`service.html`** — leadership first, followed by TPC and reviewing records.
- **`privacy.html`** — plain-language analytics/privacy disclosure.
- **`404.html`** — custom missing-page screen.
- **`assets/data/publications.js`** — the single editable publication database.
- **`assets/data/highlights.js`** — the single editable honors/talks database.
- **`assets/js/site.js`** — navigation, theme, animations, current-year display, Buffalo clock, highlights, and shared interactions.
- **`assets/js/publications.js`** — publication search/filter/sort/citation interactions.
- **`assets/js/analytics-config.js`** — the only file normally edited to enable analytics.
- **`scripts/build_site.py`** — regenerates all HTML pages from the maintained data and page templates.

No framework, database, package manager, web font, or build service is required. The site can be hosted wherever the current HTML site is hosted.

## Domain and public URL

Keep the existing public address:

```text
https://mingshihomepage.com/
```

A redesign changes the files served by the website, not the domain visitors use. If the site remains on its current hosting platform, replace the published site files and leave the registrar and DNS settings unchanged. The package retains `CNAME` with `mingshihomepage.com` for branch-based GitHub Pages deployment. If the site is later moved to a different hosting provider, update the DNS destination and the host's custom-domain setting, but keep the same public URL.

The canonical URL, sitemap, social-sharing metadata, manifest, and structured data in this package already use `https://mingshihomepage.com/`.

## Deploy over the existing site

1. **Back up the current web root.**
2. Keep the existing **`papers/`** directory. This package intentionally does not duplicate the paper PDFs.
3. Keep the existing **`ming_shi_69.jpg`** at the web root, or add the recommended optimized portrait described below.
4. Upload the **contents** of this folder to the current publishing root, replacing the old site files; do not upload the enclosing folder as a subdirectory.
5. Confirm that `https://mingshihomepage.com/` still opens the redesigned homepage over HTTPS, and test every main page on desktop and mobile.
6. Review all entries marked **Submitted** before publishing. Their labels are preserved from the supplied source and should be updated whenever a status changes.

The existing URL `research.html` changes from a publication list to the research-program page. The full publication list moves to `publications.html`. Search engines and human visitors should be directed to the new page; an optional server redirect is described below.

## Portrait optimization

The HTML first tries to load:

```text
assets/images/ming-shi.webp
```

and falls back to the existing:

```text
ming_shi_69.jpg
```

For a faster, more polished result, crop a professional portrait to approximately **4:5**, export it as WebP at roughly **1000 × 1250 px**, and keep the file under about **400 KB**. Use the exact filename `assets/images/ming-shi.webp`. The included SVG placeholder prevents a broken page while the portrait is absent.

## Update publications

Edit `assets/data/publications.js`. Each item follows this structure:

```javascript
{
  id: "unique-id",
  type: "journal",          // journal | conference | book | dissertation | report
  year: 2026,
  title: "Paper title",
  authors: "Author One, Ming Shi, and Author Three",
  studentAuthors: ["Author One"],
  venue: "Full venue and bibliographic information.",
  link: "./papers/example.pdf",
  doi: "10.xxxx/example",   // omit or leave empty when unavailable
  status: "published",      // published | submitted
  badge: "ICML",            // optional short venue/award label
  award: false,
  spotlight: false,
  featured: false,
  topics: ["Safe learning", "Networked systems"],
  sourceOrder: 1
}
```

Then run:

```bash
python3 scripts/build_site.py
```

The publication page, homepage statistics, and selected-work components use the same data source, reducing inconsistent manual edits.

### Mark a paper as selected

Set `featured: true`, or edit the `data-ids` sequence in the selected-publications container generated for `index.html`. The current homepage intentionally chooses work that communicates the overall program rather than simply showing the newest four items.

## Update honors and talks

Edit `assets/data/highlights.js`, using one of these types:

```text
honor | invited | presentation | leadership
```

Then run the same build command. The homepage automatically groups and filters the entries.

## Automatic Buffalo clock

The clock requires no API key or manual daylight-saving-time edits. `assets/js/site.js` formats the viewer's current instant using the IANA time zone:

```javascript
timeZone: "America/New_York"
```

It therefore switches between EST and EDT automatically. The copyright year is also generated automatically from the visitor's browser date.

## Visitor analytics

Analytics are **off by default**. Open `assets/js/analytics-config.js` to choose either or both options.

### Recommended default: Cloudflare Web Analytics

Paste the 32-character site token:

```javascript
cloudflareToken: "YOUR_TOKEN_HERE"
```

This is the simplest choice for aggregate page views, countries, referrers, popular URLs, and performance data. The beacon does not require the site itself to be hosted behind Cloudflare.

### Optional: Google Analytics 4

Paste the measurement ID:

```javascript
ga4MeasurementId: "G-XXXXXXXXXX"
```

The provided implementation:

- waits for opt-in consent by default;
- disables Google signals and advertising-personalization signals in the site tag;
- records annotated actions such as publication downloads, citation copies, Scholar clicks, and email clicks after consent;
- leaves the page fully functional when consent is declined or JavaScript is blocked.

Keep `requireGoogleConsent: true` unless your institution has approved another configuration. Also enable GA4 **Enhanced measurement** in the Analytics interface when you want Google's standard outbound-link and file-download events.

Analytics can show aggregate or approximate network-derived geography and referral information. It does **not** reliably identify a visitor by personal name or institutional affiliation. Do not add invasive fingerprinting or attempt to deanonymize visitors.

## Search and social sharing

The package includes:

- page-specific titles and descriptions;
- canonical URLs;
- Open Graph/Twitter metadata;
- Schema.org `Person` structured data on the homepage;
- a 1200 × 630 social preview image;
- `robots.txt` and `sitemap.xml`;
- a lightweight web-app manifest and SVG favicon.

After deployment, submit `sitemap.xml` through the search-engine webmaster account used for the domain.

## Optional redirect from the old publication URL

Because the former `research.html` page was the publication page, existing external links may point there. This redesign keeps `research.html` as a useful page rather than breaking those links. To route query-specific old links to the new list, use a host-level redirect only when you are comfortable sacrificing the new research page URL. A cleaner long-term approach is to keep both pages and update links under your control to `publications.html`.

## Accessibility and browser support

- Semantic headings, landmarks, labels, focus states, and a skip link are included.
- Animations respect `prefers-reduced-motion`.
- Content remains visible and readable without JavaScript.
- The layout is designed for current versions of Chrome, Safari, Firefox, and Edge.
- Dark mode follows the operating-system preference until the visitor explicitly chooses a theme.

## Local preview

From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

Directly opening the files also works for most content, but a local HTTP server gives more realistic URL, clipboard, and browser-security behavior.

## Pre-deployment review

See **`DEPLOYMENT-CHECKLIST.md`** for the final content, link, privacy, and performance checks.
