(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const safeStorage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (_) { /* storage may be blocked */ }
    }
  };

  // Theme: explicit choice wins, then the operating-system preference.
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeGlyph = themeButton?.querySelector('.theme-glyph');
  const storedTheme = safeStorage.get('ming-shi-site-theme');
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  function setTheme(theme, persist = false) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = normalized;
    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${normalized === 'dark' ? 'light' : 'dark'} theme`);
      themeButton.setAttribute('title', `Switch to ${normalized === 'dark' ? 'light' : 'dark'} theme`);
    }
    if (themeGlyph) themeGlyph.textContent = normalized === 'dark' ? '☀' : '◐';
    if (persist) safeStorage.set('ming-shi-site-theme', normalized);
  }

  setTheme(storedTheme || (systemDark ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  // Mobile navigation.
  const menuButton = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');

  function closeMenu() {
    if (!menuButton || !siteNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('is-open');
  }

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    siteNav?.classList.toggle('is-open', open);
  });

  siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!siteNav?.classList.contains('is-open')) return;
    if (siteNav.contains(event.target) || menuButton?.contains(event.target)) return;
    closeMenu();
  });

  // Header state and reading progress.
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('[data-scroll-progress]');
  let ticking = false;

  function updateScrollUI() {
    const y = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle('is-scrolled', y > 10);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
      progress.style.width = `${percentage}%`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // Automatically mark the active navigation item.
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === currentPage) link.setAttribute('aria-current', 'page');
    });
  }

  // Buffalo clock: automatically handles EST/EDT through IANA time-zone data.
  const clockTargets = document.querySelectorAll('[data-buffalo-time]');
  const clockFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  function updateClock() {
    if (!clockTargets.length) return;
    const now = new Date();
    const label = clockFormatter.format(now);
    clockTargets.forEach((target) => {
      target.textContent = label;
      target.setAttribute('datetime', now.toISOString());
    });
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  document.querySelectorAll('[data-current-year]').forEach((target) => {
    target.textContent = String(new Date().getFullYear());
  });

  // Reveal-on-scroll enhancement; content remains visible without JavaScript.
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  // Safe HTML helpers used by dynamic home-page components.
  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function highlightAuthor(authors = '') {
    return escapeHTML(authors).replaceAll('Ming Shi', '<strong class="current-author">Ming Shi</strong>');
  }

  const typeLabels = {
    dissertation: 'Dissertation',
    book: 'Book chapter',
    journal: 'Journal',
    conference: 'Conference',
    report: 'Technical report'
  };

  // Live statistics are calculated from the single publications data file.
  if (Array.isArray(window.PUBLICATIONS)) {
    const counts = window.PUBLICATIONS.reduce((acc, publication) => {
      acc.total += 1;
      acc[publication.type] = (acc[publication.type] || 0) + 1;
      if (publication.status === 'published') {
        acc.published[publication.type] = (acc.published[publication.type] || 0) + 1;
      }
      if (publication.award || publication.spotlight) acc.recognitions += 1;
      return acc;
    }, { total: 0, recognitions: 0, published: {} });

    document.querySelectorAll('[data-stat]').forEach((target) => {
      const key = target.dataset.stat;
      let value = counts[key];
      if (key === 'published-peer-reviewed') {
        value = (counts.published.journal || 0) + (counts.published.conference || 0);
      } else if (key.endsWith('-published')) {
        value = counts.published[key.replace('-published', '')] || 0;
      }
      if (Number.isFinite(value)) target.textContent = String(value);
    });
  }

  // Selected publications on the home page are generated from the same data source.
  const featuredContainer = document.querySelector('[data-featured-publications]');
  if (featuredContainer && Array.isArray(window.PUBLICATIONS)) {
    const selectedIds = (featuredContainer.dataset.ids || '').split(',').map((x) => x.trim()).filter(Boolean);
    const selected = selectedIds.length
      ? selectedIds.map((id) => window.PUBLICATIONS.find((item) => item.id === id)).filter(Boolean)
      : window.PUBLICATIONS.filter((item) => item.featured).slice(0, 4);

    featuredContainer.innerHTML = selected.map((paper) => {
      const tags = (paper.topics || []).slice(0, 3).map((topic) => `<span class="tag">${escapeHTML(topic)}</span>`).join('');
      const badge = paper.badge ? `<span class="tag ${paper.award || paper.spotlight ? 'tag-gold' : 'tag-blue'}">${escapeHTML(paper.badge)}</span>` : '';
      const href = escapeHTML(paper.link || 'publications.html');
      return `
        <article class="featured-paper reveal">
          <span class="card-kicker">${escapeHTML(typeLabels[paper.type] || paper.type)} · ${escapeHTML(paper.year)}</span>
          <h3><a href="${href}" data-track="featured_publication" data-track-label="${escapeHTML(paper.title)}">${escapeHTML(paper.title)}</a></h3>
          <p class="paper-authors">${highlightAuthor(paper.authors)}</p>
          <p class="paper-venue">${escapeHTML(paper.venue)}</p>
          <div class="tag-row">${badge}${tags}</div>
        </article>`;
    }).join('');

    // Dynamically inserted reveal elements need to be visible immediately.
    featuredContainer.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  // Honors and talks timeline with lightweight filtering and progressive disclosure.
  const highlightsContainer = document.querySelector('[data-highlights]');
  const highlightsButton = document.querySelector('[data-highlights-toggle]');
  const highlightFilters = document.querySelectorAll('[data-highlight-filter]');
  let highlightsExpanded = false;
  let activeHighlightType = 'all';

  function renderHighlights() {
    if (!highlightsContainer || !Array.isArray(window.HIGHLIGHTS)) return;
    const filtered = activeHighlightType === 'all'
      ? window.HIGHLIGHTS
      : window.HIGHLIGHTS.filter((item) => item.type === activeHighlightType);
    const visible = highlightsExpanded ? filtered : filtered.slice(0, 7);

    highlightsContainer.innerHTML = visible.map((item) => {
      const text = escapeHTML(item.text);
      const body = item.link
        ? `<a href="${escapeHTML(item.link)}" target="_blank" rel="noopener" data-track="highlight_link">${text}</a>`
        : text;
      const labels = { honor: 'Honor', invited: 'Invited talk', presentation: 'Presentation', leadership: 'Leadership' };
      const classes = item.type === 'honor' ? 'tag-gold' : item.type === 'invited' ? 'tag-blue' : '';
      return `
        <article class="timeline-item">
          <div class="timeline-year">${escapeHTML(item.year)}</div>
          <div class="timeline-content">
            <p>${body}</p>
            <span class="tag ${classes}">${escapeHTML(labels[item.type] || item.type)}</span>
          </div>
        </article>`;
    }).join('');

    if (highlightsButton) {
      const hasMore = filtered.length > 7;
      highlightsButton.hidden = !hasMore;
      highlightsButton.textContent = highlightsExpanded ? 'Show fewer items' : `Show all ${filtered.length} items`;
      highlightsButton.setAttribute('aria-expanded', String(highlightsExpanded));
    }
  }

  highlightFilters.forEach((button) => {
    button.addEventListener('click', () => {
      activeHighlightType = button.dataset.highlightFilter || 'all';
      highlightsExpanded = false;
      highlightFilters.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
      renderHighlights();
    });
  });

  highlightsButton?.addEventListener('click', () => {
    highlightsExpanded = !highlightsExpanded;
    renderHighlights();
  });

  renderHighlights();

  // Email convenience without placing the address in visible plain text everywhere.
  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;
      if (!email) return;
      try {
        await navigator.clipboard.writeText(email);
        const original = button.textContent;
        button.textContent = 'Email copied';
        window.setTimeout(() => { button.textContent = original; }, 1500);
        window.trackAcademicEvent?.('copy_email', { location: document.body.dataset.page || 'unknown' });
      } catch (_) {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  // Common event annotations. Delegation also covers publications inserted after filtering.
  document.addEventListener('click', (event) => {
    const element = event.target.closest?.('[data-track]');
    if (!element) return;
    window.trackAcademicEvent?.(element.dataset.track, {
      label: element.dataset.trackLabel || element.textContent.trim(),
      page: document.body.dataset.page || 'unknown'
    });
  });
})();
