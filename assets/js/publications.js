(() => {
  'use strict';

  const data = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  const list = document.querySelector('[data-publication-list]');
  if (!list) return;

  const searchInput = document.querySelector('[data-publication-search]');
  const topicSelect = document.querySelector('[data-topic-filter]');
  const yearSelect = document.querySelector('[data-year-filter]');
  const statusSelect = document.querySelector('[data-status-filter]');
  const sortSelect = document.querySelector('[data-sort-publications], [data-sort-filter]');
  const typeButtons = [...document.querySelectorAll('[data-type-filter]')];
  const resetButton = document.querySelector('[data-reset-publications], [data-filter-reset]');
  const countTarget = document.querySelector('[data-publication-count]');
  const liveRegion = document.querySelector('[data-publication-live]');

  const typeLabels = {
    all: 'All works',
    journal: 'Journal paper',
    conference: 'Conference paper',
    book: 'Book chapter',
    dissertation: 'Dissertation',
    report: 'Technical report'
  };



  const state = {
    query: '',
    type: 'all',
    topic: 'all',
    year: 'all',
    status: 'all',
    sort: 'newest'
  };

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = (value = '') => String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  function authorsHTML(publication) {
    const authors = String(publication.authors || '');
    const roles = new Map();
    const addNames = (names, role) => {
      if (!Array.isArray(names)) return;
      names.filter((name) => typeof name === 'string' && name.trim())
        .forEach((name) => roles.set(name, role));
    };
    addNames(publication.mentoredAuthors, 'mentored');
    addNames(publication.studentAuthors, 'student');
    addNames(['Linfeng Cao', 'Amirhossein Roknilamouki', 'Fatemeh Nourzad'], 'mentored');
    addNames(['Jialei Liu', 'Hui Wan'], 'student');
    roles.set('Ming Shi', 'self');

    // Match the original text once so highlighted names can never nest or become HTML.
    const pattern = [...roles.keys()].sort((a, b) => b.length - a.length)
      .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const matcher = new RegExp(pattern, 'gu');
    const nameCharacter = /[\p{L}\p{N}_]/u;
    let output = '';
    let cursor = 0;
    for (const match of authors.matchAll(matcher)) {
      const name = match[0];
      const start = match.index;
      const end = start + name.length;
      if (nameCharacter.test(authors.charAt(start - 1)) || nameCharacter.test(authors.charAt(end))) continue;
      output += escapeHTML(authors.slice(cursor, start));
      const escapedName = escapeHTML(name);
      const role = roles.get(name);
      if (role === 'self') {
        output += `<strong class="current-author">${escapedName}</strong>`;
      } else if (role === 'student') {
        output += `<span class="student-author student-author--primary" title="Student advised by Ming Shi">${escapedName}</span>`;
      } else {
        output += `<span class="mentored-author" title="Student additionally mentored by Ming Shi">${escapedName}</span>`;
      }
      cursor = end;
    }
    return output + escapeHTML(authors.slice(cursor));
  }

  function citationText(publication) {
    const suffix = publication.venue ? ` ${publication.venue}` : '';
    return `${publication.authors}. “${publication.title}.”${suffix}`.replace(/\s+/g, ' ').trim();
  }

  function shortVenue(publication) {
    if (publication.award && /WiOpt/i.test(publication.badge || '')) return 'WiOpt';
    const badge = String(publication.badge || '')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s*·\s*Accepted/gi, '')
      .replace(/\b(?:19|20)\d{2}\b/g, '')
      .trim();
    return badge || typeLabels[publication.type] || publication.type;
  }

  function publicationHTML(publication) {
    const topicTags = (publication.topics || []).map((topic) => `<span class="tag">${escapeHTML(topic)}</span>`).join('');
    const directionTags = (publication.directions || []).map((direction) => `<span class="tag tag-direction">${escapeHTML(direction)}</span>`).join('');
    const statusLabels = { accepted: 'Accepted', submitted: 'Submitted manuscript', published: 'Published' };
    const status = `<span class="publication-status-v5 status-${escapeHTML(publication.status)}">${escapeHTML(statusLabels[publication.status] || publication.status)}</span>`;
    const recognition = publication.award
      ? '<span class="tag tag-gold">Best Paper Award Runner-Up</span>'
      : publication.spotlight ? '<span class="tag tag-gold">Spotlight</span>' : '';
    const primaryLink = publication.link || '';
    const title = primaryLink
      ? `<a href="${escapeHTML(primaryLink)}" target="_blank" rel="noopener" data-track="publication_title" data-track-label="${escapeHTML(publication.title)}">${escapeHTML(publication.title)}</a>`
      : escapeHTML(publication.title);
    const linkLabel = primaryLink && /\.pdf(?:$|[?#])/i.test(primaryLink) ? 'PDF' : 'Source';
    const sourceAction = primaryLink
      ? `<a class="paper-action" href="${escapeHTML(primaryLink)}" target="_blank" rel="noopener" aria-label="Open ${linkLabel} for ${escapeHTML(publication.title)}" data-track="publication_download" data-track-label="${escapeHTML(publication.title)}">${linkLabel} →</a>`
      : '';
    const doiAction = publication.doi
      ? `<a class="paper-action" href="https://doi.org/${escapeHTML(publication.doi)}" target="_blank" rel="noopener" aria-label="DOI for ${escapeHTML(publication.title)}" data-track="doi_click" data-track-label="${escapeHTML(publication.title)}">DOI</a>`
      : '';
    const citationAction = publication.citationEnabled === false
      ? '<span class="publication-citation-note-v5">Complete citation forthcoming</span>'
      : `<button class="paper-action copy-citation" type="button" data-copy-citation="${escapeHTML(publication.id)}" aria-label="Copy citation for ${escapeHTML(publication.title)}">Copy citation</button>`;

    return `
      <article class="publication-row-v5" data-publication-id="${escapeHTML(publication.id)}" aria-labelledby="publication-${escapeHTML(publication.id)}-title">
        <div class="publication-topline-v5"><span>${escapeHTML(publication.year)}</span><span>${escapeHTML(shortVenue(publication))}</span>${status}${recognition}</div>
        <h3 id="publication-${escapeHTML(publication.id)}-title">${title}</h3>
        <p class="publication-meta-v5">${authorsHTML(publication)}</p>
        <div class="publication-actions-v5">${sourceAction}${doiAction}${citationAction}</div>
        <details class="disclosure-v5 publication-details-v5">
          <summary aria-label="Full citation and research topics for ${escapeHTML(publication.title)}"><span>Citation &amp; research details</span></summary>
          <div class="detail-body-v5">
            <p class="paper-authors">${authorsHTML(publication)}</p>
            <p class="paper-venue">${escapeHTML(publication.venue)}</p>
            ${publication.summary ? `<p class="paper-summary">${escapeHTML(publication.summary)}</p>` : ''}
            ${publication.publicNote ? `<p class="paper-note">${escapeHTML(publication.publicNote)}</p>` : ''}
            <div class="tag-row">${directionTags}${topicTags}</div>
          </div>
        </details>
      </article>`;
  }

  function filteredData() {
    const terms = normalize(state.query).split(/\s+/).filter(Boolean);
    return data.filter((publication) => {
      if (state.type !== 'all' && publication.type !== state.type) return false;
      if (state.topic !== 'all' && !(publication.topics || []).includes(state.topic)) return false;
      if (state.year !== 'all' && String(publication.year) !== state.year) return false;
      if (state.status !== 'all' && publication.status !== state.status) return false;
      if (terms.length) {
        const haystack = normalize([
          publication.title,
          publication.authors,
          publication.venue,
          publication.badge,
          publication.summary,
          publication.publicNote,
          ...(publication.directions || []),
          ...(publication.topics || [])
        ].join(' '));
        if (!terms.every((term) => haystack.includes(term))) return false;
      }
      return true;
    }).sort((a, b) => {
      if (state.sort === 'oldest') return (a.year - b.year) || (a.sourceOrder - b.sourceOrder);
      if (state.sort === 'title') return a.title.localeCompare(b.title);
      return (b.year - a.year) || (a.sourceOrder - b.sourceOrder);
    });
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    if (state.type !== 'all') params.set('type', state.type);
    if (state.topic !== 'all') params.set('topic', state.topic);
    if (state.year !== 'all') params.set('year', state.year);
    if (state.status !== 'all') params.set('status', state.status);
    if (state.sort !== 'newest') params.set('sort', state.sort);
    const url = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
    try {
      window.history.replaceState(null, '', url);
    } catch (_) {
      // Some browsers block History API updates for pages opened directly from disk.
    }
  }

  function render() {
    const results = filteredData();
    list.innerHTML = results.length
      ? results.map(publicationHTML).join('')
      : `<div class="empty-state"><h2>No matching publications</h2><p>Try removing a filter or using a broader search term.</p></div>`;

    const description = `${results.length} ${results.length === 1 ? 'work' : 'works'} shown`;
    if (countTarget) countTarget.textContent = description;
    if (liveRegion) liveRegion.textContent = description;

    list.querySelectorAll('[data-copy-citation]').forEach((button) => {
      button.addEventListener('click', async () => {
        const publication = data.find((item) => item.id === button.dataset.copyCitation);
        if (!publication) return;
        try {
          await navigator.clipboard.writeText(citationText(publication));
          const original = button.textContent;
          button.textContent = 'Copied';
          window.setTimeout(() => { button.textContent = original; }, 1500);
          window.trackAcademicEvent?.('copy_citation', { title: publication.title });
        } catch (_) {
          button.textContent = 'Copy unavailable';
        }
      });
    });

    const advancedCount = Number(state.topic !== 'all') + Number(state.year !== 'all') + Number(state.sort !== 'newest');
    const advancedState = document.querySelector('[data-advanced-filter-state]');
    if (advancedState) advancedState.textContent = advancedCount ? `${advancedCount} active` : 'Topic, year, and sort order';
    updateURL();
  }

  function populateControls() {
    const topics = [...new Set(data.flatMap((item) => item.topics || []))].sort();
    const years = [...new Set(data.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a);

    topics.forEach((topic) => topicSelect?.insertAdjacentHTML('beforeend', `<option value="${escapeHTML(topic)}">${escapeHTML(topic)}</option>`));
    years.forEach((year) => yearSelect?.insertAdjacentHTML('beforeend', `<option value="${year}">${year}</option>`));

    typeButtons.forEach((button) => {
      const type = button.dataset.typeFilter || 'all';
      const count = type === 'all' ? data.length : data.filter((item) => item.type === type).length;
      const countNode = button.querySelector('.filter-count');
      if (countNode) countNode.textContent = String(count);
    });
  }

  function readURL() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const type = params.get('type');
    const topic = params.get('topic');
    const year = params.get('year');
    const status = params.get('status');
    const sort = params.get('sort');

    if (query) state.query = query;
    if (type && (type === 'all' || data.some((item) => item.type === type))) state.type = type;
    if (topic && data.some((item) => (item.topics || []).includes(topic))) state.topic = topic;
    if (year && data.some((item) => String(item.year) === year)) state.year = year;
    if (['published', 'accepted', 'submitted'].includes(status)) state.status = status;
    if (['newest', 'oldest', 'title'].includes(sort)) state.sort = sort;
  }

  function syncControls() {
    if (searchInput) searchInput.value = state.query;
    if (topicSelect) topicSelect.value = state.topic;
    if (yearSelect) yearSelect.value = state.year;
    if (statusSelect) statusSelect.value = state.status;
    if (sortSelect) sortSelect.value = state.sort;
    typeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.typeFilter === state.type)));
  }

  let searchTimer;
  searchInput?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = searchInput.value.trim();
      render();
      window.trackAcademicEvent?.('publication_search', { query_length: state.query.length });
    }, 180);
  });

  topicSelect?.addEventListener('change', () => { state.topic = topicSelect.value; render(); });
  yearSelect?.addEventListener('change', () => { state.year = yearSelect.value; render(); });
  statusSelect?.addEventListener('change', () => { state.status = statusSelect.value; render(); });
  sortSelect?.addEventListener('change', () => { state.sort = sortSelect.value; render(); });

  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.type = button.dataset.typeFilter || 'all';
      typeButtons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
      render();
    });
  });

  resetButton?.addEventListener('click', () => {
    Object.assign(state, { query: '', type: 'all', topic: 'all', year: 'all', status: 'all', sort: 'newest' });
    syncControls();
    render();
    searchInput?.focus();
  });

  populateControls();
  readURL();
  syncControls();
  if (state.topic !== 'all' || state.year !== 'all' || state.sort !== 'newest') {
    const advanced = document.querySelector('[data-advanced-filters]');
    if (advanced) advanced.open = true;
  }
  render();
})();
