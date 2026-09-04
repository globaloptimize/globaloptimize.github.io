# Validation Report

Validated on September 4, 2026 after the heading and domain revisions.

## Automated browser checks

```json
{
  "homepage": {
    "horizontal_overflow": false,
    "publication_statistics": ["20", "4", "16", "2"],
    "featured_publications": 4,
    "initial_highlights": 7,
    "expanded_highlights": 27,
    "javascript_errors": []
  },
  "research_page": {
    "horizontal_overflow": false,
    "javascript_errors": []
  },
  "publications_page": {
    "initial_records": 32,
    "search_results_for_switching_costs": 9,
    "journal_filter_results": 7,
    "horizontal_overflow": false,
    "javascript_errors": []
  },
  "mobile_navigation": {
    "horizontal_overflow": false,
    "closed_visibility": "hidden",
    "closed_aria_expanded": "false",
    "open_visibility": "visible",
    "open_aria_expanded": "true",
    "open_button_label": "Close navigation",
    "javascript_errors": []
  }
}
```

All seven HTML pages were also checked at desktop width. No page produced horizontal overflow or a JavaScript error. The Buffalo clock rendered with the `America/New_York` time zone and updated automatically.

## Static and build checks

- Every HTML page contains exactly one `h1` and no duplicate element IDs.
- Every canonical URL uses `https://mingshihomepage.com/`.
- The root `CNAME` contains only `mingshihomepage.com`.
- All bundled internal assets and internal HTML destinations resolve.
- The retired vague headings and subtitles are absent from both generated HTML and the build script.
- The structured data files contain 32 publication records and 27 honor/talk records.
- Python compilation, JavaScript syntax checks, the site build, and web-manifest JSON parsing all pass.
- The social-sharing card is 1200 × 630 pixels.

## Deployment assets retained outside this package

The production upload should retain the existing `papers/` directory and the current `ming_shi_69.jpg` portrait. The HTML also supports an optional optimized portrait at `assets/images/ming-shi.webp`; when it is absent, the current JPEG is used, and a bundled illustration is available as the final fallback.
