# Deployment Checklist

## Domain and hosting

- [ ] Keep the public homepage URL as `https://mingshihomepage.com/`; no new domain is required.
- [ ] If deploying to the current hosting location, leave the registrar and DNS records unchanged.
- [ ] Upload the package contents to the publishing root so that `index.html` is at the top level.
- [ ] For branch-based GitHub Pages, keep the root-level `CNAME` file containing exactly `mingshihomepage.com`.
- [ ] In GitHub **Settings → Pages**, confirm the custom domain is `mingshihomepage.com` and HTTPS enforcement is enabled.
- [ ] Confirm that `https://www.mingshihomepage.com/` redirects to the preferred apex address.
- [ ] Change DNS records only if moving the site to a different hosting provider; the public domain can remain the same.

## Content accuracy

- [ ] Confirm current title, department name, affiliations, office, email, and biography.
- [ ] Review every 2026 item labeled **Submitted** and change `status`, venue wording, DOI, and PDF link as appropriate.
- [ ] Confirm the spelling and preferred presentation of every student name.
- [ ] Confirm service roles and “present” date ranges remain current.
- [ ] Add any newer awards, invited talks, accepted papers, courses, or outreach activities.
- [ ] Decide whether to add a current CV; do not publish a broken `cv.pdf` link.

## Files and links

- [ ] Preserve the current `papers/` directory in the web root.
- [ ] Preserve `ming_shi_69.jpg` or add `assets/images/ming-shi.webp`.
- [ ] Open every local PDF link, especially filenames containing spaces or punctuation.
- [ ] Test Google Scholar, LinkedIn, UB profile, DOI, Purdue, Ohio State, advisor, and news links.
- [ ] Confirm `https://mingshihomepage.com/` is the final canonical domain.
- [ ] Keep `CNAME` only when the hosting platform uses it (for example, GitHub Pages).

## Visual and accessibility checks

- [ ] Test widths near 1440 px, 1024 px, 768 px, 390 px, and 320 px.
- [ ] Test light and dark themes.
- [ ] Navigate the full site with keyboard only.
- [ ] Confirm visible focus indicators, menu operation, search/filter labels, and details controls.
- [ ] Check contrast and legibility on the actual portrait.
- [ ] Test with reduced-motion enabled.
- [ ] Confirm that disabling JavaScript still leaves the complete content readable.

## Analytics and privacy

- [ ] Choose Cloudflare Web Analytics, GA4, both, or neither.
- [ ] Paste identifiers only into `assets/js/analytics-config.js`.
- [ ] Confirm the privacy page matches the selected services.
- [ ] Verify that GA4 remains unloaded until consent when `requireGoogleConsent` is true.
- [ ] Verify real-time analytics with your own test visit, then exclude or recognize internal traffic during interpretation.
- [ ] Do not claim analytics identify specific people; reports are aggregate/approximate.

## Search, social, and performance

- [ ] Confirm the social card appears when the homepage is shared.
- [ ] Validate `sitemap.xml` and submit it through the appropriate webmaster console.
- [ ] Confirm `robots.txt` is reachable.
- [ ] Compress the production portrait and keep it reasonably small.
- [ ] Check that pages load without console errors or mixed HTTP/HTTPS content.
- [ ] Run a Lighthouse audit after deployment and address any hosting-specific findings.

## Safe launch

- [ ] Download a complete backup of the existing site.
- [ ] Deploy to a temporary/staging directory first when the host supports it.
- [ ] Verify all pages over HTTPS on the real domain.
- [ ] Keep the backup until the redesigned site has operated correctly for at least one normal update cycle.
