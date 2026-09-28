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

The accepted NeurIPS 2026 manuscript supplied for this update is anonymous. The public record therefore uses the temporary author text **“Ming Shi and collaborators”**, disables citation copying for that entry, and provides no reviewer-copy PDF. Replace the temporary text and add the public link after the camera-ready citation is available.
