# Ming Shi Academic Homepage — Version 4

A responsive, static academic website for **Ming Shi**, Assistant Professor of Electrical and Computer Engineering at the University at Buffalo.

Version 4 reorganizes the site around one coherent research program:

> **Mathematical foundations for reliable networked intelligence.**

The site connects theory, algorithms, systems, teaching, mentoring, service, and outreach without reducing the research portfolio to a flat list of topics.

## Main pages

- **`index.html`** — research identity, four scientific contributions with paper evidence, future vision, societal relevance, completed educational outreach, selected papers, recent updates, and contact.
- **`research.html`** — the main research narrative, five illustrated directions, an interactive cross-cutting research atlas, and a mathematical toolkit.
- **`publications.html`** — searchable publication/manuscript record with filters for type, topic, year, and status.
- **`studentsandteaching.html`** — Ph.D. students, mentoring philosophy, illustrated courses, undergraduate/graduate learning pathways, completed outreach, and outreach in development.
- **`service.html`** — university governance, conference leadership, technical program committees, and comprehensive review records.
- **`privacy.html`** — analytics and visitor-privacy disclosure.
- **`404.html`** — custom missing-page screen.

## Research architecture

The site presents five mutually connected directions:

1. **Safe and verifiable learning** — instantaneous hard constraints, safe RL, non-convex safety, viability, coupled multi-agent safety, and zero-violation guarantees.
2. **Prediction and costly adaptation** — online convex optimization, switching and ramp costs, lookahead, competitive analysis, forecast-robust RL, provisioning, scheduling, and reconfiguration.
3. **Partial and human information** — POMDPs, partial online state information, active probing, multi-objective learning, preference feedback, RLHF, and certified experience sharing.
4. **Distributed and multi-agent intelligence** — graph-structured coordination, cloud–edge–device learning, communication/computation control, selective observation, and foundation models under concept drift.
5. **Dynamic, secure, and robust AI** — adversarial/nonstationary RL, Age of Intelligence, dynamic attack surfaces, LLM security, stale-model control, and robustness limits.

A project may belong to several directions. This is implemented through `assets/data/research-projects.js` and the filterable research atlas on `research.html`.

## New accepted work represented in this version

- **NeurIPS 2026:** *Zero-Violation Regret for Cooperative Markov Games with Coupled Instantaneous Hard Constraints*.
- **ACM MobiHoc AIoT 2026:** *Fresh Enough to Decide: Age of Intelligence for Cost-Aware Model Synchronization in Dynamic IoT Systems*.

The public site does **not** contain the confidential NeurIPS reviewer-copy PDF. The current publication entry uses “Ming Shi and collaborators” and a “complete citation forthcoming” note because the supplied accepted manuscript is anonymous. Replace that temporary author line and add the public paper link when the camera-ready version is available.

## Important files

```text
assets/data/publications.js       publication database
assets/data/research-projects.js  cross-cutting research/project atlas
assets/data/highlights.js         awards, talks, presentations, and leadership
assets/js/site.js                 navigation, theme, clock, shared rendering
assets/js/research.js             research-atlas search and filters
assets/js/publications.js         publication search, filters, and citations
assets/css/styles.css             full visual system and responsive layout
assets/css/home.css               homepage layout and responsive refinements
assets/images/research/           five research-direction illustrations
assets/images/teaching/           course, mentoring, and outreach illustrations
scripts/build_site.py             validation, sitemap update, cache-version bump
```

The site has no framework, database, package manager, or external font dependency.

## Homepage editorial approach

The homepage leads with contributions rather than publication counts or a long news feed. Its four contribution summaries link directly to the underlying papers; the Research page retains the detailed five-direction program. Core contribution, vision, and impact content is static HTML and remains readable without JavaScript.

Keep quantitative claims tied to their setting. The Power-of-2-Arms result concerns the paper's adversarial bandit model with switching costs. The 6.15% synchronization-cost reduction comes from Table 1 in the AIoT paper: mean total cost 451.42 versus 481.02 for Instant-Param across 20 validation traces. It is a numerical result, not a deployment result. The abstract's separate 49% claim uses a different baseline absent from the results table; reconcile the manuscript before using that claim publicly. Safety guarantees depend on the assumptions and probability statements in the linked papers. National and societal relevance describes the motivating problems; do not present it as demonstrated adoption or economic impact without supporting evidence.

Student achievements and completed outreach are drawn from `studentsandteaching.html`. Planned activities remain on that page under outreach in development. The NeurIPS entry retains its accepted status and citation-forthcoming note.

Organization was informed by the public homepage sources of [Jon Barron](https://github.com/jonbarron/website/blob/master/index.html) and [Jia-Bin Huang](https://github.com/jbhuang0604/jbhuang0604.github.io/blob/master/index.html): concise positioning, paper-backed contribution summaries, quick section navigation, and clear student/collaborator pathways.

## Deploy without changing the domain

Keep the public URL:

```text
https://mingshihomepage.com/
```

Upload the **contents** of this folder to the current GitHub Pages repository or publishing root. Do not upload the enclosing folder as a subdirectory. Keep the root-level `CNAME` file containing:

```text
mingshihomepage.com
```

The package directly loads the portrait from:

```text
ming_shi_69.jpg
```

beside `index.html`. The full package already contains that photograph.

## Update publications

Edit `assets/data/publications.js`. A typical record is:

```javascript
{
  id: "p35",
  type: "conference",
  title: "Paper title",
  authors: "Author One, Ming Shi, and Author Three",
  studentAuthors: ["Author One"],
  venue: "Venue, year.",
  year: 2027,
  link: "./papers/example.pdf",
  doi: "",
  badge: "ICML 2027",
  status: "accepted", // published | accepted | submitted
  topics: ["Reinforcement learning"],
  directions: ["Safe & verifiable learning"],
  featured: true,
  sourceOrder: 0,
  summary: "One-sentence contribution statement."
}
```

One publication can list multiple `directions`. The publication page and homepage use the same data source.

## Update the research atlas

Edit `assets/data/research-projects.js`. Each record contains:

- one or more direction keys: `safety`, `adaptation`, `information`, `distributed`, `robust`;
- a high-level problem summary;
- the core technical idea;
- methods and systems/application tags;
- a paper or page link.

This lets one paper or project appear under several research directions without duplicating the record.

## Update mentoring, teaching, service, and outreach

These sections are intentionally human-edited in:

- `studentsandteaching.html`
- `service.html`

Completed outreach and planned outreach are separated. Keep “in development” wording for demonstrations that have not yet been delivered.

## Validate before deployment

For a read-only validation that preserves the sitemap date:

```bash
python3 scripts/build_site.py --no-sitemap
```

To also refresh the sitemap for deployment, run:

```bash
python3 scripts/build_site.py
```

The validator checks:

- structured-data syntax and unique IDs;
- required publication fields;
- local links and paper files;
- duplicate HTML IDs and `h1` counts;
- the required portrait and illustration assets;
- accidental inclusion of the confidential NeurIPS reviewer copy;
- the sitemap date.

To force browsers to retrieve a changed CSS/JS/data file, bump the cache version:

```bash
python3 scripts/build_site.py --version 20260928-5
```

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Automatic clock and analytics

The Buffalo clock uses the IANA time zone `America/New_York`; EST/EDT changes are automatic. The footer year is automatic as well.

Analytics are off by default. Configure Cloudflare Web Analytics or consent-gated GA4 only in:

```text
assets/js/analytics-config.js
```

Analytics can report aggregate visits, referrers, pages, and approximate geography. It cannot reliably identify a visitor by name.

## Final checks

See:

- `DEPLOYMENT-CHECKLIST.md`
- `VALIDATION-REPORT.md`
- `HEADINGS-AND-MESSAGING.md`
- `CONTENT-MIGRATION-NOTES.md`
- `PORTRAIT-SETUP.md`
