(() => {
  'use strict';

  const data = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  const list = document.querySelector('[data-publication-list]');
  if (!list) return;

  const searchInput = document.querySelector('[data-publication-search]');
  const topicSelect = document.querySelector('[data-topic-filter]');
  const yearSelect = document.querySelector('[data-year-filter]');
  const statusSelect = document.querySelector('[data-status-filter]');
  const sortSelect = document.querySelector('[data-sort-publications]');
  const typeButtons = [...document.querySelectorAll('[data-type-filter]')];
  const resetButton = document.querySelector('[data-reset-publications]');
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

  const typePlural = {
    all: 'works',
    journal: 'journal papers',
    conference: 'conference papers',
    book: 'book chapters',
    dissertation: 'dissertations',
    report: 'technical reports'
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
    let output = escapeHTML(publication.authors || '');
    (publication.studentAuthors || []).forEach((student) => {
      const escaped = escapeHTML(student);
      output = output.replaceAll(escaped, `<span class="student-author">${escaped}</span>`);
    });
    return output.replaceAll('Ming Shi', '<strong class="current-author">Ming Shi</strong>');
  }

  function citationText(publication) {
    const suffix = publication.venue ? ` ${publication.venue}` : '';
    return `${publication.authors}. “${publication.title}.”${suffix}`.replace(/\s+/g, ' ').trim();
  }

  function publicationHTML(publication) {
    const topicTags = (publication.topics || []).map((topic) => `<span class="tag">${escapeHTML(topic)}</span>`).join('');
    const badgeClass = publication.award || publication.spotlight ? 'tag-gold' : 'tag-blue';
    const badge = publication.badge ? `<span class="tag ${badgeClass}">${escapeHTML(publication.badge)}</span>` : '';
    const status = publication.status === 'submitted' ? '<span class="tag">Submitted</span>' : '';
    const primaryLink = publication.link || '';
    const title = primaryLink
      ? `<a href="${escapeHTML(primaryLink)}" target="_blank" rel="noopener" data-track="publication_title" data-track-label="${escapeHTML(publication.title)}">${escapeHTML(publication.title)}</a>`
      : escapeHTML(publication.title);
    const linkLabel = primaryLink && /\.pdf(?:$|[?#])/i.test(primaryLink) ? 'PDF' : 'Source';
    const sourceAction = primaryLink
      ? `<a class="paper-action" href="${escapeHTML(primaryLink)}" target="_blank" rel="noopener" data-track="publication_download" data-track-label="${escapeHTML(publication.title)}">↗ ${linkLabel}</a>`
      : '';
    const doiAction = publication.doi
      ? `<a class="paper-action" href="https://doi.org/${escapeHTML(publication.doi)}" target="_blank" rel="noopener" data-track="doi_click" data-track-label="${escapeHTML(publication.title)}">DOI</a>`
      : '';

    return `
      <article class="publication-card ${publication.featured ? 'is-featured' : ''}" data-publication-id="${escapeHTML(publication.id)}">
        <div class="publication-topline">
          <span class="publication-type">${escapeHTML(typeLabels[publication.type] || publication.type)}</span>
          <span class="publication-year">${escapeHTML(publication.year)}</span>
          ${badge}${status}
        </div>
        <h2>${title}</h2>
        <p class="paper-authors">${authorsHTML(publication)}</p>
        <p class="paper-venue">${escapeHTML(publication.venue)}</p>
        <div class="tag-row">${topicTags}</div>
        <div class="publication-actions">
          ${sourceAction}${doiAction}
          <button class="paper-action copy-citation" type="button" data-copy-citation="${escapeHTML(publication.id)}">Copy citation</button>
        </div>
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
    if (status === 'published' || status === 'submitted') state.status = status;
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
  render();
})();
