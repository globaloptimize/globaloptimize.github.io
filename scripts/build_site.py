from pathlib import Path
import json, html, re

ROOT = Path(__file__).resolve().parents[1]
PUBLICATIONS = json.loads((ROOT / 'assets/data/publications.js').read_text(encoding='utf-8').removeprefix('window.PUBLICATIONS = ').removesuffix(';\n'))
HIGHLIGHTS = json.loads((ROOT / 'assets/data/highlights.js').read_text(encoding='utf-8').removeprefix('window.HIGHLIGHTS = ').removesuffix(';\n'))

SITE_URL = 'https://mingshihomepage.com'
EMAIL = 'mshi24@buffalo.edu'
SCHOLAR = 'https://scholar.google.com/citations?user=GDiJkA0AAAAJ&hl=en'
LINKEDIN = 'https://www.linkedin.com/in/ming-shi-1b12a1159/'
UB = 'https://engineering.buffalo.edu/ee/faculty/faculty_directory.host.html/content/shared/engineering/ee/profiles/shi-ming.html'


def esc(value):
    return html.escape(str(value), quote=True)


def early_script():
    return """<script>
      document.documentElement.classList.add('js');
      try {
        const saved = localStorage.getItem('ming-shi-site-theme');
        const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = saved || (dark ? 'dark' : 'light');
      } catch (_) {}
    </script>"""


def head(title, description, path, extra=''):
    canonical = f'{SITE_URL}/{path}' if path else f'{SITE_URL}/'
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  {early_script()}
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="author" content="Ming Shi">
  <meta name="theme-color" content="#005bbb">
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="site.webmanifest">
  <link rel="stylesheet" href="assets/css/styles.css">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Ming Shi — Academic Homepage">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{SITE_URL}/assets/images/social-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  {extra}
</head>"""


def header():
    return f"""<a class="skip-link" href="#main-content">Skip to main content</a>
<header class="site-header">
  <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
  <div class="container nav-wrap">
    <a class="brand" href="/" aria-label="Ming Shi home">
      <span class="brand-mark" aria-hidden="true">MS</span>
      <span class="brand-text">
        <span class="brand-name">Ming Shi</span>
        <span class="brand-role">Safe Learning · Online Optimization · Networked Systems</span>
      </span>
    </a>

    <nav class="site-nav" data-site-nav aria-label="Primary navigation">
      <a class="nav-link" data-nav="home" href="/">Home</a>
      <a class="nav-link" data-nav="research" href="research.html">Research</a>
      <a class="nav-link" data-nav="publications" href="publications.html">Publications</a>
      <a class="nav-link" data-nav="people" href="studentsandteaching.html">Students &amp; Teaching</a>
      <a class="nav-link" data-nav="service" href="service.html">Service</a>
    </nav>

    <div class="nav-actions">
      <a class="icon-button header-scholar" href="{SCHOLAR}" target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar" data-track="scholar_click">G</a>
      <button class="icon-button" type="button" data-theme-toggle aria-label="Switch color theme" title="Switch color theme"><span class="theme-glyph" aria-hidden="true">◐</span></button>
      <button class="menu-button" type="button" data-menu-toggle aria-label="Open navigation" aria-expanded="false"><span class="menu-lines" aria-hidden="true"></span></button>
    </div>
  </div>
</header>"""


def footer():
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">
          <span class="brand-mark" aria-hidden="true">MS</span>
          <span class="brand-text"><span class="brand-name">Ming Shi</span><span class="brand-role">University at Buffalo</span></span>
        </a>
        <p>Safe learning and resource-aware optimization for networked autonomous systems.</p>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="research.html">Research</a>
        <a href="publications.html">Publications</a>
        <a href="studentsandteaching.html">Students &amp; Teaching</a>
        <a href="service.html">Service</a>
        <a href="{SCHOLAR}" target="_blank" rel="noopener">Google Scholar</a>
        <a href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="privacy.html">Privacy</a>
      </nav>
      <div class="footer-time">
        <span class="footer-time-label">Buffalo local time</span>
        <time data-buffalo-time>Loading…</time>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-current-year></span> Ming Shi. All rights reserved.</span>
      <span>Buffalo, New York · Eastern Time</span>
    </div>
  </div>
</footer>
<script src="assets/js/analytics-config.js"></script>
<script src="assets/js/analytics.js"></script>
<script src="assets/js/site.js"></script>"""


def page(title, description, path, page_id, content, extra_head='', before_site_scripts=''):
    return f"""{head(title, description, path, extra_head)}
<body data-page="{page_id}">
{header()}
<main id="main-content">
{content}
</main>
{footer().replace('<script src="assets/js/site.js"></script>', before_site_scripts + '\n<script src="assets/js/site.js"></script>')}
</body>
</html>
"""


def author_html(authors, student_authors=None):
    output = esc(authors)
    for student in student_authors or []:
        output = output.replace(esc(student), f'<span class="student-author">{esc(student)}</span>')
    return output.replace('Ming Shi', '<strong class="current-author">Ming Shi</strong>')


def paper_card(p):
    badge = ''
    if p.get('badge'):
        cls = 'tag-gold' if p.get('award') or p.get('spotlight') else 'tag-blue'
        badge = f'<span class="tag {cls}">{esc(p["badge"])}</span>'
    status = '<span class="tag">Submitted</span>' if p.get('status') == 'submitted' else ''
    topics = ''.join(f'<span class="tag">{esc(topic)}</span>' for topic in p.get('topics', []))
    title = esc(p['title'])
    if p.get('link'):
        title = f'<a href="{esc(p["link"])}" target="_blank" rel="noopener">{title}</a>'
    source_action = ''
    if p.get('link'):
        label = 'PDF' if re.search(r'\.pdf(?:$|[?#])', p['link'], re.I) else 'Source'
        source_action = f'<a class="paper-action" href="{esc(p["link"])}" target="_blank" rel="noopener">↗ {label}</a>'
    doi_action = f'<a class="paper-action" href="https://doi.org/{esc(p["doi"])}" target="_blank" rel="noopener">DOI</a>' if p.get('doi') else ''
    type_labels = {'journal':'Journal paper','conference':'Conference paper','book':'Book chapter','dissertation':'Dissertation','report':'Technical report'}
    return f"""<article class="publication-card {'is-featured' if p.get('featured') else ''}" data-publication-id="{esc(p['id'])}">
      <div class="publication-topline"><span class="publication-type">{type_labels[p['type']]}</span><span class="publication-year">{p['year']}</span>{badge}{status}</div>
      <h2>{title}</h2>
      <p class="paper-authors">{author_html(p['authors'], p.get('studentAuthors'))}</p>
      <p class="paper-venue">{esc(p['venue'])}</p>
      <div class="tag-row">{topics}</div>
      <div class="publication-actions">{source_action}{doi_action}<button class="paper-action copy-citation" type="button" data-copy-citation="{esc(p['id'])}">Copy citation</button></div>
    </article>"""


def featured_paper(p):
    tags = ''.join(f'<span class="tag">{esc(x)}</span>' for x in p.get('topics', [])[:3])
    badge = ''
    if p.get('badge'):
        cls = 'tag-gold' if p.get('award') or p.get('spotlight') else 'tag-blue'
        badge = f'<span class="tag {cls}">{esc(p["badge"])}</span>'
    return f"""<article class="featured-paper reveal">
      <span class="card-kicker">{esc(p['type'].replace('conference','Conference').replace('journal','Journal').title())} · {p['year']}</span>
      <h3><a href="{esc(p['link'])}" target="_blank" rel="noopener">{esc(p['title'])}</a></h3>
      <p class="paper-authors">{author_html(p['authors'], p.get('studentAuthors'))}</p>
      <p class="paper-venue">{esc(p['venue'])}</p>
      <div class="tag-row">{badge}{tags}</div>
    </article>"""


def highlight_item(item):
    body = esc(item['text'])
    if item.get('link'):
        body = f'<a href="{esc(item["link"])}" target="_blank" rel="noopener">{body}</a>'
    labels = {'honor':'Honor','invited':'Invited talk','presentation':'Presentation','leadership':'Leadership'}
    cls = 'tag-gold' if item['type'] == 'honor' else 'tag-blue' if item['type'] == 'invited' else ''
    return f"""<article class="timeline-item">
      <div class="timeline-year">{item['year']}</div>
      <div class="timeline-content"><p>{body}</p><span class="tag {cls}">{labels.get(item['type'], item['type'])}</span></div>
    </article>"""

# ---------- Home ----------
selected_ids = ['p10','p03','p22','p04']
selected = [next(p for p in PUBLICATIONS if p['id'] == pid) for pid in selected_ids]
featured_fallback = '\n'.join(featured_paper(p) for p in selected)
highlights_fallback = '\n'.join(highlight_item(h) for h in HIGHLIGHTS)

person_schema = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ming Shi",
  "url": "{SITE_URL}/",
  "jobTitle": "Assistant Professor",
  "email": "mailto:{EMAIL}",
  "affiliation": {{"@type": "CollegeOrUniversity", "name": "University at Buffalo, The State University of New York"}},
  "alumniOf": {{"@type": "CollegeOrUniversity", "name": "Purdue University"}},
  "sameAs": ["{UB}", "{SCHOLAR}", "{LINKEDIN}"],
  "knowsAbout": ["Machine learning theory", "Reinforcement learning", "Online optimization", "Bandit learning", "Network optimization", "Wireless and edge AI", "Networked autonomous systems"]
}}
</script>"""

home_content = f"""
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy reveal">
      <span class="eyebrow">Assistant Professor · Electrical and Computer Engineering · University at Buffalo</span>
      <h1>
        <span class="hero-title-line">Ming Shi</span>
        <span class="hero-headline-main">Safe learning and online optimization</span>
        <span class="hero-headline-domain">for networked autonomous systems.</span>
      </h1>
      <p class="hero-thesis">Reinforcement learning, online optimization, and bandits under hard constraints, limited information, and costly adaptation.</p>
      <p class="hero-description">I develop algorithms and fundamental performance guarantees for systems that must learn and adapt without compromising safety, reliability, or resource efficiency.</p>
      <div class="button-row hero-actions">
        <a class="button button-primary" href="research.html">Explore the research program <span aria-hidden="true">→</span></a>
        <a class="button button-secondary" href="publications.html">Browse publications</a>
        <a class="button button-secondary" href="mailto:{EMAIL}" data-track="email_click">Email</a>
      </div>
      <div class="hero-meta" aria-label="Professional information">
        <span>Assistant Professor · University at Buffalo</span>
        <span>Electrical &amp; Computer Engineering</span>
        <a href="{UB}" target="_blank" rel="noopener">Official UB profile ↗</a>
      </div>
    </div>

    <aside class="hero-profile reveal" aria-label="Ming Shi profile">
      <figure class="hero-card">
        <div class="portrait-wrap">
          <img src="ming_shi_69.jpg" width="800" height="1100" alt="Portrait of Ming Shi" fetchpriority="high" decoding="async" onerror="this.onerror=null;this.src='assets/images/portrait-placeholder.svg';">
        </div>
        <figcaption class="portrait-caption">
          <div>
            <strong>Ming Shi, Ph.D.</strong>
            <span>Assistant Professor · Electrical and Computer Engineering</span>
          </div>
          <a href="https://engineering.buffalo.edu/ee/faculty/faculty_directory.host.html/content/shared/engineering/ee/profiles/shi-ming.html" target="_blank" rel="noopener">University at Buffalo ↗</a>
        </figcaption>
      </figure>
      <div class="availability-chip"><span class="availability-dot" aria-hidden="true"></span><span>Buffalo · <time data-buffalo-time>local time</time></span></div>
    </aside>
  </div>
</section>

<section class="section-compact" aria-label="Research record at a glance">
  <div class="container stats-grid">
    <article class="stat-card reveal"><span class="stat-value" data-stat="published-peer-reviewed">20</span><span class="stat-label">published journal and conference papers</span></article>
    <article class="stat-card reveal"><span class="stat-value" data-stat="journal-published">4</span><span class="stat-label">published journal papers</span></article>
    <article class="stat-card reveal"><span class="stat-value" data-stat="conference-published">16</span><span class="stat-label">published conference papers</span></article>
    <article class="stat-card reveal"><span class="stat-value">2</span><span class="stat-label">Ph.D. students at UB</span></article>
  </div>
</section>

<section class="section" id="biography">
  <div class="container research-detail">
    <div class="research-index reveal"><span class="eyebrow">Academic profile</span><h2>Assistant Professor of Electrical and Computer Engineering at UB</h2><p class="muted">Affiliated with the Institute for Artificial Intelligence and Data Science.</p></div>
    <div class="research-body reveal">
      <p class="lede">Ming Shi received his Ph.D. degree in Electrical and Computer Engineering from <a href="https://www.purdue.edu" target="_blank" rel="noopener">Purdue University</a> in 2022, advised by Prof. <a href="https://staff.ie.cuhk.edu.hk/~xjlin/" target="_blank" rel="noopener">Xiaojun Lin</a>.</p>
      <p>From 2022 to 2024, he was a Post-Doctoral Scholar in Electrical and Computer Engineering at <a href="https://www.osu.edu" target="_blank" rel="noopener">The Ohio State University</a> and was affiliated with the NSF AI-EDGE Institute, advised by Prof. <a href="http://newslab.ece.ohio-state.edu/home" target="_blank" rel="noopener">Ness B. Shroff</a> and Prof. <a href="https://sites.google.com/view/yingbinliang/home" target="_blank" rel="noopener">Yingbin Liang</a>.</p>
      <div class="tag-row"><span class="tag tag-blue">228 Davis Hall</span><span class="tag">mshi24 [at] buffalo [dot] edu</span><span class="tag">University at Buffalo, SUNY</span></div>
    </div>
  </div>
</section>

<section class="section section-blue" id="research-program">
  <div class="container">
    <div class="section-heading reveal">
      <div><span class="eyebrow">Research directions</span><h2>Safe learning, resource-aware adaptation, and decision-making with limited information.</h2><p>These directions address how networked and autonomous systems can learn under uncertainty while satisfying safety, information, and resource constraints.</p></div>
      <a class="section-link" href="research.html">Full research overview</a>
    </div>
    <div class="card-grid">
      <article class="card card-hover thrust-card reveal">
        <span class="thrust-number">01</span><span class="card-kicker">Safe reinforcement learning</span>
        <h3>Learning under instantaneous hard constraints</h3>
        <p>Algorithms and limits for reinforcement learning when unsafe exploration is unacceptable and guarantees must hold throughout learning—not only on average or asymptotically.</p>
        <div class="tag-row"><span class="tag">Safe RL</span><span class="tag">Adversarial RL</span><span class="tag">Robustness</span></div>
      </article>
      <article class="card card-hover thrust-card reveal">
        <span class="thrust-number">02</span><span class="card-kicker">Online optimization and bandits</span>
        <h3>Adaptation with switching and reconfiguration costs</h3>
        <p>Learning and optimization for systems where changing actions, models, schedules, or configurations consumes time, energy, bandwidth, or operational capacity.</p>
        <div class="tag-row"><span class="tag">Online optimization</span><span class="tag">Bandits</span><span class="tag">Scheduling</span></div>
      </article>
      <article class="card card-hover thrust-card reveal">
        <span class="thrust-number">03</span><span class="card-kicker">Partial observability and preferences</span>
        <h3>Learning from partial state and imperfect feedback</h3>
        <p>Decision-making with partial state information, imperfect preferences, conversational queries, and heterogeneous feedback across distributed and multi-objective systems.</p>
        <div class="tag-row"><span class="tag">POMDPs</span><span class="tag">Preferences</span><span class="tag">Multi-objective learning</span></div>
      </article>
    </div>
  </div>
</section>

<section class="section" id="selected-work">
  <div class="container">
    <div class="section-heading reveal">
      <div><span class="eyebrow">Selected publications</span><h2>Results in safe learning, partial observability, and resource-aware decision-making.</h2><p>These papers illustrate the program’s progression from fundamental guarantees to algorithms for networked and autonomous systems.</p></div>
      <a class="section-link" href="publications.html">Complete publication record</a>
    </div>
    <div class="featured-publications" data-featured-publications data-ids="{','.join(selected_ids)}">{featured_fallback}</div>
  </div>
</section>

<section class="section section-muted" id="impact">
  <div class="container">
    <div class="section-heading reveal">
      <div><span class="eyebrow">Research approach and applications</span><h2>Theoretical guarantees for dynamic networked and autonomous systems.</h2><p>The work connects learning-theoretic analysis with operational constraints from wireless, edge-AI, data-center, distributed, and human-in-the-loop systems.</p></div>
    </div>
    <div class="card-grid card-grid-2">
      <article class="card project-card reveal"><span class="project-icon" aria-hidden="true">Σ</span><div><h3>Learning-theoretic guarantees</h3><p>Regret, competitive analysis, sample complexity, impossibility results, and performance bounds characterize what is achievable and at what information or resource cost.</p></div></article>
      <article class="card project-card reveal"><span class="project-icon" aria-hidden="true">↻</span><div><h3>Nonstationary and adversarial environments</h3><p>Models account explicitly for drift, adversarial inputs, partial observability, regime changes, and cross-level constraints.</p></div></article>
      <article class="card project-card reveal"><span class="project-icon" aria-hidden="true">⌁</span><div><h3>Network resource allocation and coordination</h3><p>Resource allocation, scheduling, communication, sensing, and distributed coordination connect algorithmic choices to system-level reliability and efficiency.</p></div></article>
      <article class="card project-card reveal"><span class="project-icon" aria-hidden="true">◎</span><div><h3>Preference-aware and human-in-the-loop learning</h3><p>Preference feedback, conversational queries, safety constraints, and multi-objective learning support systems that better reflect human goals and operational requirements.</p></div></article>
    </div>
  </div>
</section>

<section class="section" id="highlights">
  <div class="container">
    <div class="section-heading reveal">
      <div><span class="eyebrow">Recognition and presentations</span><h2>Awards, invited talks, and conference presentations.</h2><p>Use the filters to view honors, invited talks, research presentations, and professional leadership activities.</p></div>
    </div>
    <div class="timeline-controls" aria-label="Filter highlights">
      <button class="filter-chip" type="button" data-highlight-filter="all" aria-pressed="true">All</button>
      <button class="filter-chip" type="button" data-highlight-filter="honor" aria-pressed="false">Honors</button>
      <button class="filter-chip" type="button" data-highlight-filter="invited" aria-pressed="false">Invited talks</button>
      <button class="filter-chip" type="button" data-highlight-filter="presentation" aria-pressed="false">Presentations</button>
      <button class="filter-chip" type="button" data-highlight-filter="leadership" aria-pressed="false">Leadership</button>
    </div>
    <div class="timeline" data-highlights>{highlights_fallback}</div>
    <button class="button button-secondary timeline-more" type="button" data-highlights-toggle aria-expanded="false">Show all highlights</button>
  </div>
</section>

<section class="section section-compact">
  <div class="container cta-panel reveal">
    <div><span class="eyebrow">Contact</span><h2>Prospective students and research collaborators.</h2><p>Research inquiries are most useful when they identify a specific problem, publication, or research direction connected to the program.</p></div>
    <div class="button-row"><a class="button button-primary" href="mailto:{EMAIL}">Contact Ming Shi</a><button class="button button-secondary" type="button" data-copy-email="{EMAIL}">Copy email</button></div>
  </div>
</section>
"""

home = page(
    'Ming Shi | Safe Learning, Online Optimization, and Networked Systems',
    'Ming Shi is an Assistant Professor at the University at Buffalo developing foundations of safe and resource-adaptive decision-making for networked autonomous systems.',
    '', 'home', home_content, person_schema,
    before_site_scripts='<script src="assets/data/publications.js"></script>\n<script src="assets/data/highlights.js"></script>'
)
(ROOT / 'index.html').write_text(home, encoding='utf-8')

# ---------- Research ----------
research_content = f"""
<section class="page-hero research-hero">
  <div class="container page-hero-grid">
    <div class="reveal">
      <span class="eyebrow">Research overview</span>
      <h1>Safe learning and resource-adaptive optimization for <span class="display-accent">networked systems.</span></h1>
      <p class="lede">I study algorithms and fundamental limits for sequential decisions under uncertainty, hard constraints, limited information, and costly adaptation.</p>
      <div class="pill-list" aria-label="Research areas"><span class="pill">Reinforcement learning</span><span class="pill">Online optimization</span><span class="pill">Bandit learning</span><span class="pill">Network optimization</span><span class="pill">Distributed systems</span></div>
      <div class="button-row" style="margin-top:1.5rem"><a class="button button-primary" href="publications.html">Explore publications</a><a class="button button-secondary" href="mailto:{EMAIL}">Discuss collaboration</a></div>
    </div>
    <figure class="research-visual reveal"><img src="assets/images/research-constellation.svg" width="920" height="690" alt="Diagram connecting uncertainty, safe decisions, resource adaptation, learning feedback, and networked autonomous systems"></figure>
  </div>
</section>

<section class="section-compact section-muted">
  <div class="container">
    <div class="research-flow" aria-label="Research pathway">
      <div class="flow-step reveal"><strong>Observe</strong><span>partial, delayed, noisy, or strategic information</span></div>
      <div class="flow-step reveal"><strong>Learn</strong><span>models, policies, preferences, and uncertainty sets</span></div>
      <div class="flow-step reveal"><strong>Decide</strong><span>online under safety, resource, and coupling constraints</span></div>
      <div class="flow-step reveal"><strong>Adapt</strong><span>to drift, adversaries, switching costs, and regimes</span></div>
      <div class="flow-step reveal"><strong>Guarantee</strong><span>reliability, efficiency, regret, and system performance</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <article class="research-detail" id="safe-learning">
      <div class="research-index reveal"><span class="research-index-number">01</span><span class="eyebrow">Safe reinforcement learning</span><h2>Learning under instantaneous hard constraints</h2><p class="muted">Safety guarantees must hold throughout learning—not only after convergence.</p></div>
      <div class="research-body reveal">
        <p class="lede">Many autonomous systems cannot afford unsafe exploration. The goal is to learn effectively while respecting instantaneous constraints in uncertain, partially observed, non-convex, or adversarial environments.</p>
        <h3>Research questions</h3>
        <ul class="question-list"><li>How can a learner explore without violating hard constraints?</li><li>Which safety guarantees are achievable under limited information?</li><li>How do adversarial transitions, modeling errors, and non-convex feature spaces alter the fundamental limits?</li></ul>
        <h3>Selected publications</h3>
        <div class="paper-link-list">
          <a class="paper-link" href="./papers/SafeRL-NonConvex_ICML2025.pdf"><span class="paper-year">2025</span><span class="paper-link-title">Provably Efficient Reinforcement Learning for Linear MDPs under Instantaneous Safety Constraints in Non-Convex Feature Spaces</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/First-SafeRL-Work_ICML2023.pdf"><span class="paper-year">2023</span><span class="paper-link-title">A Near-Optimal Algorithm for Safe Reinforcement Learning Under Instantaneous Hard Constraints</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/RL-AdversarialTransition_ICLR2026.pdf"><span class="paper-year">2026</span><span class="paper-link-title">Minimax Optimal Adversarial Reinforcement Learning</span><span class="paper-link-arrow">↗</span></a>
        </div>
      </div>
    </article>

    <article class="research-detail" id="resource-adaptation">
      <div class="research-index reveal"><span class="research-index-number">02</span><span class="eyebrow">Online optimization and bandits</span><h2>Adaptation with switching, reconfiguration, and coupling costs</h2><p class="muted">Changing actions, schedules, models, or configurations consumes resources.</p></div>
      <div class="research-body reveal">
        <p class="lede">Networked systems continuously reconfigure schedules, models, routes, sensing modes, and computing resources. This thrust studies how to balance immediate performance against the operational cost and cross-layer consequences of change.</p>
        <h3>Research questions</h3>
        <ul class="question-list"><li>When is additional prediction, feedback, or limited multi-arm information worth its cost?</li><li>How should provisioning and scheduling be coordinated across time scales?</li><li>What competitive or regret guarantees remain possible with ramp and coupling constraints?</li></ul>
        <h3>Selected publications</h3>
        <div class="paper-link-list">
          <a class="paper-link" href="./papers/Bi-Level Opt-Lrn_WiOPT2026.pdf"><span class="paper-year">2026</span><span class="paper-link-title">Bi-Level Online Provisioning and Scheduling with Switching Costs and Cross-Level Constraints</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/Power-of-2-learning_ToN2025.pdf"><span class="paper-year">2025</span><span class="paper-link-title">Power-of-2-Arms for Adversarial Bandit Learning with Switching Costs</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/Regularization-lookahead-OCO_ToN2024.pdf"><span class="paper-year">2024</span><span class="paper-link-title">Combining Regularization With Look-Ahead for Competitive Online Convex Optimization</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/OCO-switching-ramp_ToN2021.pdf"><span class="paper-year">2021</span><span class="paper-link-title">Competitive Online Convex Optimization with Switching Costs and Ramp Constraints</span><span class="paper-link-arrow">↗</span></a>
        </div>
      </div>
    </article>

    <article class="research-detail" id="limited-information">
      <div class="research-index reveal"><span class="research-index-number">03</span><span class="eyebrow">Partial observability and preference learning</span><h2>Learning from partial state and imperfect feedback</h2><p class="muted">The learner may not observe the full state or know the objective exactly.</p></div>
      <div class="research-body reveal">
        <p class="lede">This thrust develops learning methods for partially observable systems and settings where preferences, objectives, or feedback sources are imperfect, heterogeneous, personalized, or costly to query.</p>
        <h3>Research questions</h3>
        <ul class="question-list"><li>How much online state information is necessary in a POMDP?</li><li>How should imperfect preference sources be combined without losing statistical efficiency?</li><li>When do proactive conversational queries improve personalized multi-objective learning?</li></ul>
        <h3>Selected publications</h3>
        <div class="paper-link-list">
          <a class="paper-link" href="./papers/First-POMDP-POSI_TIT2026.pdf"><span class="paper-year">2026</span><span class="paper-link-title">Reinforcement Learning with Partial Online State Information in POMDPs: Regret Bounds and Limits</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="https://arxiv.org/pdf/2603.20453"><span class="paper-year">2026</span><span class="paper-link-title">Regret Bounds for Reinforcement Learning from Multi-Source Imperfect Preferences</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/Person-MOB-Query_UAI2026.pdf"><span class="paper-year">2026</span><span class="paper-link-title">Provably Efficient Personalized Multi-Objective Bandits with Proactive Conversational Queries</span><span class="paper-link-arrow">↗</span></a>
          <a class="paper-link" href="./papers/PtC-Multi-Arm-Feedback_WiOPT2026.pdf"><span class="paper-year">2026</span><span class="paper-link-title">Probe-then-Commit Multi-Objective Bandits: Theoretical Benefits of Limited Multi-Arm Feedback</span><span class="paper-link-arrow">↗</span></a>
        </div>
      </div>
    </article>
  </div>
</section>

<section class="section section-blue">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Application domains</span><h2>Wireless, edge-AI, distributed, and autonomous systems.</h2><p>These domains motivate the safety, information, communication, and resource constraints studied in the theoretical models.</p></div></div>
    <div class="card-grid">
      <article class="card reveal"><span class="card-kicker">Networks and computing</span><h3>Wireless, edge-AI, and data-center systems</h3><p>Resource allocation, age of information, sensing, communication, scheduling, and adaptive computing under uncertain demand and channel conditions.</p></article>
      <article class="card reveal"><span class="card-kicker">Distributed autonomy</span><h3>Multi-agent and networked decision systems</h3><p>Coordination with limited communication, partial observability, dynamic constraints, strategic corruption, and changing operational regimes.</p></article>
      <article class="card reveal"><span class="card-kicker">Emerging AI systems</span><h3>AI-enabled cyber-physical and computing platforms</h3><p>Extensions to secure systems, recommendation and preference learning, large language models, quantum networking, and quantum machine learning.</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container cta-panel reveal"><div><span class="eyebrow">Publication record</span><h2>Browse all publications and technical reports.</h2><p>Search by topic, year, publication type, or status; open available papers; and copy formatted citations.</p></div><div class="button-row"><a class="button button-primary" href="publications.html">Open publication explorer</a><a class="button button-secondary" href="{SCHOLAR}" target="_blank" rel="noopener">Google Scholar ↗</a></div></div>
</section>
"""
(ROOT / 'research.html').write_text(page(
    'Research | Safe Learning and Networked Systems | Ming Shi',
    'Research program of Ming Shi: safe learning, resource-adaptive online decision-making, and learning from partial and preference feedback for networked autonomous systems.',
    'research.html', 'research', research_content
), encoding='utf-8')

# ---------- Publications ----------
all_cards = '\n'.join(paper_card(p) for p in sorted(PUBLICATIONS, key=lambda x: (-x['year'], x['sourceOrder'])))
publication_content = f"""
<section class="page-hero research-hero">
  <div class="container narrow reveal">
    <span class="eyebrow">Publication record</span>
    <h1>Publications in <span class="display-accent">learning, optimization, and networked systems.</span></h1>
    <p class="lede">Search and filter the complete record by type, topic, year, or status. Student authors are underlined, Ming Shi is bolded, and available paper and DOI links are included.</p>
    <div class="button-row"><a class="button button-primary" href="{SCHOLAR}" target="_blank" rel="noopener">Google Scholar ↗</a><a class="button button-secondary" href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn ↗</a><button class="button button-secondary" type="button" onclick="window.print()">Print / save PDF</button></div>
  </div>
</section>

<section class="section-compact">
  <div class="container publications-layout">
    <aside class="publication-filters" aria-label="Publication filters">
      <div class="filter-group"><label class="filter-label" for="publication-search">Search</label><div class="search-box"><input id="publication-search" type="search" placeholder="Title, author, venue…" autocomplete="off" data-publication-search></div></div>
      <div class="filter-group"><span class="filter-label">Publication type</span><div class="type-filter-list">
        <button class="type-filter" type="button" data-type-filter="all" aria-pressed="true"><span>All works</span><span class="filter-count">32</span></button>
        <button class="type-filter" type="button" data-type-filter="journal" aria-pressed="false"><span>Journal papers</span><span class="filter-count">7</span></button>
        <button class="type-filter" type="button" data-type-filter="conference" aria-pressed="false"><span>Conference papers</span><span class="filter-count">20</span></button>
        <button class="type-filter" type="button" data-type-filter="book" aria-pressed="false"><span>Book chapter</span><span class="filter-count">1</span></button>
        <button class="type-filter" type="button" data-type-filter="dissertation" aria-pressed="false"><span>Dissertation</span><span class="filter-count">1</span></button>
        <button class="type-filter" type="button" data-type-filter="report" aria-pressed="false"><span>Technical reports</span><span class="filter-count">3</span></button>
      </div></div>
      <div class="filter-group"><label class="filter-label" for="topic-filter">Topic</label><select class="filter-select" id="topic-filter" data-topic-filter><option value="all">All topics</option></select></div>
      <div class="filter-group"><label class="filter-label" for="year-filter">Year</label><select class="filter-select" id="year-filter" data-year-filter><option value="all">All years</option></select></div>
      <div class="filter-group"><label class="filter-label" for="status-filter">Status</label><select class="filter-select" id="status-filter" data-status-filter><option value="all">All statuses</option><option value="published">Published / accepted</option><option value="submitted">Submitted</option></select></div>
      <div class="filter-group"><button class="button button-secondary" style="width:100%" type="button" data-reset-publications>Reset filters</button></div>
    </aside>

    <div>
      <div class="publication-toolbar"><p class="publication-result-count" data-publication-count>32 works shown</p><label><span class="sr-only">Sort publications</span><select class="filter-select" data-sort-publications><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option></select></label></div>
      <p class="no-js-note">JavaScript adds search, filtering, and citation-copying. The full publication list remains visible without it.</p>
      <div class="sr-only" aria-live="polite" data-publication-live></div>
      <div class="publication-list" data-publication-list>{all_cards}</div>
    </div>
  </div>
</section>

<section class="section-compact section-muted">
  <div class="container"><p class="muted text-small"><strong>Student authors:</strong> student names from the existing publication page are underlined. <strong>Status note:</strong> entries labeled “submitted” are retained exactly as provided; review those statuses before deployment because several refer to 2026 venues.</p></div>
</section>
"""
(ROOT / 'publications.html').write_text(page(
    'Publications | Ming Shi',
    'Search publications by Ming Shi in reinforcement learning, online optimization, bandit learning, safe learning, and networked systems.',
    'publications.html', 'publications', publication_content,
    before_site_scripts='<script src="assets/data/publications.js"></script>\n<script src="assets/js/publications.js"></script>'
), encoding='utf-8')

# ---------- People & Teaching ----------
people_content = f"""
<section class="page-hero research-hero">
  <div class="container narrow reveal"><span class="eyebrow">Students, teaching, and outreach</span><h1>Research mentoring, teaching, and <span class="display-accent">outreach.</span></h1><p class="lede">Current Ph.D. students, courses taught, and outreach activities in faculty mentoring, undergraduate research, and K–12 engagement.</p><div class="button-row"><a class="button button-primary" href="mailto:{EMAIL}">Research inquiries</a><a class="button button-secondary" href="research.html">View research directions</a></div></div>
</section>

<section class="section section-blue">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Current students</span><h2>Ph.D. students at the University at Buffalo.</h2><p>Current doctoral researchers and their academic backgrounds.</p></div></div>
    <div class="profile-grid">
      <article class="person-card reveal"><div class="person-initials" aria-hidden="true">HW</div><div><h3>Hui Wan</h3><span class="person-period">Fall 2026–present · EE at UB</span><p>Master’s degree from Jilin University; B.Sc. from Jilin University, ranked 2/90.</p></div></article>
      <article class="person-card reveal"><div class="person-initials" aria-hidden="true">JL</div><div><h3>Jialei Liu</h3><span class="person-period">Fall 2025–present · EE at UB</span><p>Master’s degree from The Ohio State University; B.Sc. from Chongqing University.</p></div></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Teaching</span><h2>Networking and optimization courses taught at UB, Ohio State, and Purdue.</h2><p>Courses cover computer communication networks and convex optimization for communication and machine learning.</p></div></div>
    <div class="course-list">
      <article class="course-card reveal"><span class="course-code">EE 434/534 · UB</span><h3>Principles of Networking</h3><p>Department of Electrical Engineering, University at Buffalo · Spring 2026.</p></article>
      <article class="course-card reveal"><span class="course-code">EE 441/541 · UB</span><h3>Convex Optimization with Applications in Communication and Machine Learning</h3><p>Department of Electrical Engineering, University at Buffalo · Fall 2025 and Fall 2026.</p></article>
      <article class="course-card reveal"><span class="course-code">ECE 5101 &amp; CSE 6461 · Ohio State</span><h3>Computer Communication Networks</h3><p>Departments of Electrical and Computer Engineering and Computer Science and Engineering, The Ohio State University · Fall 2023.</p></article>
      <article class="course-card reveal"><span class="course-code">ECE 54700 · Purdue</span><h3>Introduction to Computer Communication Networks</h3><p>School of Electrical and Computer Engineering, Purdue University · Fall 2016 and Fall 2019.</p></article>
    </div>
  </div>
</section>

<section class="section section-muted">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Outreach</span><h2>Faculty mentoring, undergraduate research, and K–12 engagement.</h2><p>Activities that support early exposure to engineering, computing, and research.</p></div></div>
    <div class="outreach-grid">
      <article class="outreach-card reveal"><span class="card-kicker">Faculty mentoring</span><h3>EAS 202 Faculty Mentor Week</h3><p>School of Engineering and Applied Sciences, University at Buffalo · Spring 2026.</p></article>
      <article class="outreach-card reveal"><span class="card-kicker">Undergraduate research</span><h3>NSF REU</h3><p>NSF AI-EDGE Institute, The Ohio State University · Summers 2023 and 2024.</p></article>
      <article class="outreach-card reveal"><span class="card-kicker">K–12 engagement</span><h3>LEGO FIRST League</h3><p>The Ohio State University · Fall 2023.</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container cta-panel reveal"><div><span class="eyebrow">Prospective Ph.D. students</span><h2>What to include in a research inquiry.</h2><p>Briefly describe your preparation, the research problem that interests you, and how it connects to one of the research directions. Include a CV and relevant writing or project samples when available.</p></div><div class="button-row"><a class="button button-primary" href="mailto:{EMAIL}?subject=Prospective%20student%20inquiry">Email inquiry</a><button class="button button-secondary" type="button" data-copy-email="{EMAIL}">Copy email</button></div></div>
</section>
"""
(ROOT / 'studentsandteaching.html').write_text(page(
    'Students, Teaching, and Outreach | Ming Shi',
    'Ph.D. students, teaching, mentoring, and outreach activities of Ming Shi at the University at Buffalo.',
    'studentsandteaching.html', 'people', people_content
), encoding='utf-8')

# ---------- Service ----------
service_content = """
<section class="page-hero research-hero">
  <div class="container narrow reveal"><span class="eyebrow">Professional service</span><h1>Conference leadership, technical program committees, and <span class="display-accent">peer review.</span></h1><p class="lede">Service across machine learning, networking, information theory, security, signal processing, optimization, and control.</p></div>
</section>

<section class="section-compact">
  <div class="container service-summary-grid">
    <article class="service-summary reveal"><strong>Conference leadership</strong><span>Organizing, web, session, discussion, workshop, and cluster leadership roles.</span></article>
    <article class="service-summary reveal"><strong>Technical programs</strong><span>TPC service spanning networking, mobile systems, security, and game theory.</span></article>
    <article class="service-summary reveal"><strong>Peer review</strong><span>Journal and conference reviewing across theory, machine learning, networking, signal processing, and control.</span></article>
  </div>
</section>

<section class="section section-blue">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Leadership and organizing</span><h2>Conference, workshop, and university roles.</h2></div></div>
    <div class="service-columns">
      <article class="service-panel reveal"><h2>Conference leadership</h2><ul class="role-list">
        <li><strong>Organizing Co-Chair and Web Chair</strong><br>IEEE/IFIP WiOpt · 2025–present</li>
        <li><strong>Session Chair</strong>, Federated &amp; Distributed Learning<br>ACM MobiHoc · October 2025</li>
        <li><strong>Discussion Lead</strong><br>ACM SIGMETRICS · 2025–present</li>
        <li><strong>Organizing Committee</strong><br>Buffalo Day for 5G and Wireless Internet of Things · 2024</li>
      </ul></article>
      <article class="service-panel reveal"><h2>University leadership</h2><ul class="role-list">
        <li><strong>Organizing Co-Chair</strong><br>UB SEAS Joint Workshop · 2026</li>
        <li><strong>Co-Chair</strong><br>SEAS AI Cluster · 2025–present</li>
      </ul></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Technical program committees</span><h2>Committee service in networking, security, performance, and AI.</h2></div></div>
    <div class="card-grid card-grid-2">
      <article class="card reveal"><span class="card-kicker">Networking &amp; mobile systems</span><h3>IEEE INFOCOM</h3><p>Technical Program Committee · 2026–present.</p></article>
      <article class="card reveal"><span class="card-kicker">Security</span><h3>IEEE Symposium on Security and Privacy</h3><p>Technical Program Committee · 2026–present.</p></article>
      <article class="card reveal"><span class="card-kicker">Mobile computing</span><h3>ACM MobiHoc</h3><p>Technical Program Committee · 2025–present.</p></article>
      <article class="card reveal"><span class="card-kicker">Performance &amp; optimization</span><h3>ACM SIGMETRICS and IEEE WiOpt</h3><p>Technical Program Committee · 2025–present.</p></article>
      <article class="card reveal"><span class="card-kicker">AI &amp; security</span><h3>Conference on Game Theory and AI for Security</h3><p>Technical Program Committee · 2026–present.</p></article>
    </div>
  </div>
</section>

<section class="section section-muted">
  <div class="container">
    <div class="section-heading reveal"><div><span class="eyebrow">Peer review</span><h2>Journal and conference reviewing.</h2><p>The complete reviewing record is grouped by venue type.</p></div></div>
    <details class="service-details reveal" open><summary>Journal reviewing</summary><div class="details-body"><ul class="role-list">
      <li>IEEE/ACM Transactions on Networking (IEEE/ACM ToN), 2019–present.</li>
      <li>IEEE Journal on Selected Areas in Communications (IEEE JSAC), 2026–present.</li>
      <li>IEEE Transactions on Information Theory (IEEE TIT), 2023–present.</li>
      <li>IEEE Transactions on Wireless Communications (IEEE TWC), 2025–present.</li>
      <li>IEEE Transactions on Mobile Computing (IEEE TMC), 2023–present.</li>
      <li>IEEE Transactions on Network Science and Engineering (IEEE TNSE), 2021–present.</li>
      <li>IEEE Transactions on Signal Processing (IEEE TSP), 2023–present.</li>
      <li>IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), 2026–present.</li>
      <li>Journal of Machine Learning Research (JMLR), 2025–present.</li>
      <li>Journal of Computational Design and Engineering (JCDE), 2025–present.</li>
      <li>Automatica, International Federation of Automatic Control (IFAC), 2025–present.</li>
    </ul></div></details>
    <details class="service-details reveal"><summary>Conference reviewing</summary><div class="details-body"><ul class="role-list">
      <li>IEEE International Conference on Computer Communications (IEEE INFOCOM), 2023–present.</li>
      <li>ACM International Symposium on Theory, Algorithmic Foundations, and Protocol Design for Mobile Networks and Mobile Computing (ACM MobiHoc), 2025–present.</li>
      <li>IEEE International Symposium on Modeling and Optimization in Mobile, Ad Hoc, and Wireless Networks (IEEE WiOpt), 2025–present.</li>
      <li>IEEE International Symposium on Information Theory (IEEE ISIT), 2023–present.</li>
      <li>Conference on Neural Information Processing Systems (NeurIPS), 2023–present.</li>
      <li>International Conference on Machine Learning (ICML), 2024–present.</li>
      <li>International Conference on Learning Representations (ICLR), 2023–present.</li>
      <li>International Conference on Artificial Intelligence and Statistics (AISTATS), 2024–present.</li>
      <li>Association for the Advancement of Artificial Intelligence (AAAI), 2024–present.</li>
      <li>ACM SIGMETRICS, 2025–present.</li>
      <li>Asian Conference on Machine Learning (ACML), 2024–present.</li>
    </ul></div></details>
  </div>
</section>
"""
(ROOT / 'service.html').write_text(page(
    'Professional Service | Ming Shi',
    'Conference leadership, technical program committees, and peer-review service by Ming Shi.',
    'service.html', 'service', service_content
), encoding='utf-8')

# ---------- Privacy ----------
privacy_content = f"""
<section class="page-hero research-hero"><div class="container narrow reveal"><span class="eyebrow">Website privacy</span><h1>Analytics and visitor privacy.</h1><p class="lede">The site can optionally collect aggregate traffic and engagement data; analytics remain disabled until a provider identifier is added.</p></div></section>
<section class="section-compact"><div class="container prose">
  <h2>Analytics are disabled by default</h2><p>The delivered code does not collect analytics until an analytics token or measurement ID is added to <code>assets/js/analytics-config.js</code>.</p>
  <h2>Cloudflare Web Analytics</h2><p>When a Cloudflare token is configured, the site loads Cloudflare’s lightweight analytics beacon. It is intended for aggregate measurements such as page views, referral sources, and site performance without relying on cookies or local storage for visitor tracking.</p>
  <h2>Google Analytics 4</h2><p>When a GA4 measurement ID is configured, the default code asks visitors to opt in before loading Google Analytics. The configuration disables Google Signals and advertising personalization. GA4 can report aggregate geographic dimensions and engagement events, including supported file downloads and outbound links.</p>
  <h2>What analytics cannot identify</h2><p>Aggregate analytics cannot tell the site owner the real-world identity of a typical visitor. Geographic estimates may be imprecise because of VPNs, institutional networks, mobile carriers, privacy tools, and IP-based approximation.</p>
  <h2>Privacy contact</h2><p>Questions about this website can be sent to <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
</div></section>
"""
(ROOT / 'privacy.html').write_text(page(
    'Privacy | Ming Shi',
    'Privacy and analytics information for Ming Shi’s academic homepage.',
    'privacy.html', 'privacy', privacy_content
), encoding='utf-8')

# ---------- 404 ----------
not_found = f"""{head('Page not found | Ming Shi', 'The requested page could not be found.', '404.html')}
<body data-page="404">{header()}<main id="main-content"><section class="page-hero research-hero"><div class="container narrow"><span class="eyebrow">Error 404</span><h1>Page not found.</h1><p class="lede">The requested address does not match a page on this site.</p><div class="button-row"><a class="button button-primary" href="/">Return home</a><a class="button button-secondary" href="publications.html">Find a publication</a></div></div></section></main>{footer()}</body></html>"""
(ROOT / '404.html').write_text(not_found, encoding='utf-8')

print('Built HTML pages:', ', '.join(p.name for p in ROOT.glob('*.html')))
if not (ROOT / 'ming_shi_69.jpg').exists():
    print('Portrait reminder: place ming_shi_69.jpg in the website root beside index.html.')
