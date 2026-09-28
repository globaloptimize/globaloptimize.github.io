# Deployment Checklist — Version 4

## 1. Preserve the public domain

- [ ] Keep `https://mingshihomepage.com/` as the public homepage.
- [ ] Upload the package contents to the current publishing root so `index.html` remains top-level.
- [ ] Keep the root `CNAME` file containing exactly `mingshihomepage.com` when using branch-based GitHub Pages.
- [ ] Confirm the GitHub Pages custom domain and **Enforce HTTPS** setting.
- [ ] Do not change DNS unless moving to a different hosting provider.

## 2. Back up and publish safely

- [ ] Download a complete backup of the current repository/site.
- [ ] Preserve any untracked paper PDFs or other assets not present in the package.
- [ ] Confirm `ming_shi_69.jpg` is beside `index.html`.
- [ ] Upload folders without flattening their structure.
- [ ] Do not publish `pdf(1).pdf`, a NeurIPS reviewer copy, or any other confidential submission file.

## 3. Verify current content

- [ ] Replace “Ming Shi and collaborators” with the complete NeurIPS 2026 author list when the public citation is available.
- [ ] Add the public NeurIPS paper/camera-ready link when available.
- [ ] Confirm the AIoT 2026 final citation, DOI, and camera-ready link when assigned.
- [ ] Review all records marked **Submitted** and update decisions, venues, links, and dates.
- [ ] Confirm student dates, course offerings, office, affiliations, committee roles, and service date ranges.
- [ ] Keep not-yet-delivered outreach explicitly labeled **in development**.

## 4. Run validation

```bash
python3 scripts/build_site.py
```

- [ ] Resolve every reported error.
- [ ] Open the homepage, research, publications, mentoring/teaching, service, and privacy pages.
- [ ] Test publication and research filters.
- [ ] Test desktop and mobile navigation.
- [ ] Test light and dark modes.
- [ ] Open every local PDF link.

## 5. Clear stale browser caches

When CSS, JavaScript, or data files change, use:

```bash
python3 scripts/build_site.py --version YYYYMMDD-N
```

- [ ] Commit the changed HTML version strings.
- [ ] After deployment, perform a hard refresh (`Command + Shift + R` on macOS Chrome/Safari where supported).

## 6. Accessibility and performance

- [ ] Navigate with keyboard only and confirm visible focus states.
- [ ] Check the mobile menu at approximately 390 px and 320 px widths.
- [ ] Confirm no horizontal scrolling at common widths.
- [ ] Check the illustrations in dark mode.
- [ ] Consider compressing `ming_shi_69.jpg` to roughly 900–1200 px wide and under 500 KB while keeping the same filename.
- [ ] Run Lighthouse after deployment to identify hosting-specific issues.

## 7. Search, sharing, and privacy

- [ ] Confirm `robots.txt`, `sitemap.xml`, and the social card are reachable.
- [ ] Submit or refresh the sitemap in the webmaster console used for the domain.
- [ ] Configure analytics only in `assets/js/analytics-config.js`.
- [ ] Confirm `privacy.html` matches the analytics actually enabled.
- [ ] Do not describe analytics as identifying specific people.
