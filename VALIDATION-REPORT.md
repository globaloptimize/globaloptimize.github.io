# Validation Report — Version 4

Validated on **September 28, 2026**.

## Structured content

- 34 publication/manuscript records
  - 25 published
  - 2 accepted
  - 7 submitted
- 16 cross-cutting research projects/research lines
- 30 honors, talks, presentations, and leadership entries
- Unique IDs verified for all three structured data sets

## Static validation

`python3 scripts/build_site.py` completed successfully.

Checks passed for:

- required publication fields;
- unique publication, project, and highlight IDs;
- local HTML, image, script, stylesheet, and paper links;
- one principal `h1` per main page;
- duplicate element IDs;
- required portrait and illustration assets;
- sitemap generation;
- exclusion of the confidential NeurIPS reviewer-copy PDF.

JavaScript syntax checks passed for the publication, research, highlight, and shared-site scripts.

## Browser-render validation

The HTML, CSS, JavaScript, data, SVG illustrations, and portrait were rendered in headless Chromium through a self-contained local test harness. No page-level JavaScript errors were observed.

### Research atlas

- Initial projects: 16
- Safe-and-verifiable filter: 3
- Search for `quantum`: 1
- Safety filter combined with `quantum`: 0, as expected

### Publication explorer

- Initial records: 34
- Accepted filter: 2
- Accepted plus `Age of Intelligence` search: 1
- Journal filter: 7

### Responsive interaction

- Mobile menu hidden before activation
- Mobile menu visible after activation
- `aria-expanded` changes to `true`
- No horizontal overflow at 1440 px or 390 px in the tested pages
- Portrait loaded at its natural dimensions
- Light/dark theme toggle changed the document theme successfully
- Buffalo time rendered using `America/New_York`

## Visual review

Desktop previews were reviewed for:

- homepage hero and portrait balance;
- research-program hero and agenda illustration;
- mentoring/teaching hero and mentoring-cycle illustration;
- professional-service hierarchy;
- publication-page hierarchy;
- mobile homepage typography and navigation.

Full-page review confirmed that the five research directions, project atlas, teaching illustrations, mentoring sections, outreach sections, and service records render in the intended order.

## Known maintenance item

Resolved by the user-supplied named manuscript: **Jialei Liu and Ming Shi**, NeurIPS 2026 (accepted). The public PDF is `papers/MARL-IHC_NeurIPS2026.pdf`, and citation copying is enabled. The private CV is not published.

## Current update verification — November 5, 2026

- 34 complete publication records, 16 research projects, and 31 highlights validate.
- The supplied named NeurIPS PDF matches the uploaded file byte for byte.
- Full author lists and both student-mentoring styles render correctly; full citation copying works.
- All seven HTML pages and 50 local destinations respond successfully; five primary pages fit 320–1440 px widths.
- All 22 research diagrams initialize; search/filter replacements retain their diagrams. Play/pause, actual SVG movement, reduced motion, dark mode, and static no-JavaScript fallbacks passed.
- Public CV updates, teaching/service records, and the talk archive passed browser checks.
- A private-source scan found no proposal-title markers in public text or the new PDF. The raw CV is outside the repository.
- All five photographs are published from the exact JPEG originals supplied in `Archive.zip`, verified byte for byte. The archive and macOS resource files remain outside the repository.
- Four personal photographs appear inside the initially collapsed “Beyond Research” gallery; the National Grid photograph accompanies its outreach record. All images load successfully.
- Photo enlargement, Tab/Shift+Tab focus containment, Escape, close-button and backdrop dismissal, focus restoration, and preservation of the previous scroll setting pass browser checks.
- The gallery and photo viewer fit 320–1440 px widths, inherit dark mode, and respect reduced motion. Native disclosures and original-image links work with JavaScript disabled; no browser errors or failed local requests were observed.
- The homepage education list contains only the Assistant Professor, Post-Doctoral Scholar, and Ph.D. entries; the B.Sc. entry remains removed.
