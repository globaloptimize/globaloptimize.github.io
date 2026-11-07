(() => {
  'use strict';

  const data = Array.isArray(window.RESEARCH_PROJECTS) ? window.RESEARCH_PROJECTS : [];
  const list = document.querySelector('[data-research-projects]');
  if (!list || !data.length) return;

  const buttons = [...document.querySelectorAll('[data-research-filter]')];
  const count = document.querySelector('[data-research-count]');
  const live = document.querySelector('[data-research-live]');
  const search = document.querySelector('[data-research-search]');
  let active = 'all';
  let query = '';

  const labels = {
    safety: 'Safe & Verifiable Learning',
    adaptation: 'Prediction & Costly Adaptation',
    information: 'Partial & Human Information',
    distributed: 'Distributed & Multi-Agent Intelligence',
    robust: 'Dynamic, Secure & Robust AI'
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

  function visibleProjects() {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return data.filter((project) => {
      if (active !== 'all' && !(project.directions || []).includes(active)) return false;
      if (!terms.length) return true;
      const haystack = normalize([
        project.title,
        project.status,
        project.kind,
        project.summary,
        project.insight,
        ...(project.methods || []),
        ...(project.systems || []),
        ...(project.directions || []).map((key) => labels[key] || key)
      ].map((value) => window.SiteI18n?.searchText(value) || value || '').join(' '));
      return terms.every((term) => haystack.includes(term));
    }).sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title));
  }

  function card(project) {
    const visualKeys = { safety: 'safety', adaptation: 'adaptation', information: 'information', distributed: 'coordination', robust: 'robustness' };
    const visualKind = visualKeys[(project.directions || [])[0]] || 'vision';
    const directionTags = (project.directions || [])
      .map((key) => `<span class="tag">${escapeHTML(labels[key] || key)}</span>`)
      .join('');
    const methodTags = (project.methods || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join('');
    const systemTags = (project.systems || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join('');
    const link = project.link
      ? `<a class="project-link" href="${escapeHTML(project.link)}" ${project.link.startsWith('http') || /\.pdf(?:$|[?#])/i.test(project.link) ? 'target="_blank" rel="noopener"' : ''}>${/\.pdf(?:$|[?#])/i.test(project.link) ? 'Read PDF' : 'Related Work'} <span aria-hidden="true">→</span></a>`
      : '';
    return `
      <article class="project-record-v5" data-project-id="${escapeHTML(project.id)}">
        <details class="disclosure-v5">
          <summary><span class="disclosure-label-v5"><strong>${escapeHTML(project.title)}</strong><small>${escapeHTML(project.status)} · ${escapeHTML(project.kind)}</small></span></summary>
          <div class="detail-body-v5">
            <p>${escapeHTML(project.summary)}</p>
            <div class="research-diagram-v7" data-research-visual="${visualKind}" aria-label="Conceptual illustration for ${escapeHTML(project.title)}"><p class="muted text-small">The illustration is conceptual; see the linked work for models, assumptions, and results.</p></div>
            <p><strong>Core idea:</strong> ${escapeHTML(project.insight)}</p>
            <div class="tag-row">${directionTags}</div>
            <div class="split-v5">
              <div><h4>Methods</h4><div class="tag-row">${methodTags}</div></div>
              <div><h4>Application Context</h4><div class="tag-row">${systemTags}</div></div>
            </div>
            ${link}
          </div>
        </details>
      </article>`;
  }

  function render() {
    const projects = visibleProjects();
    list.innerHTML = projects.length
      ? projects.map(card).join('')
      : '<div class="empty-state"><h3>No matching projects</h3><p>Choose another direction or use a broader search term.</p></div>';
    const message = `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} shown`;
    if (count) count.textContent = message;
    if (live) live.textContent = message;
  }

  buttons.forEach((button) => {
    const key = button.dataset.researchFilter || 'all';
    const n = key === 'all' ? data.length : data.filter((project) => (project.directions || []).includes(key)).length;
    button.querySelector('[data-filter-count]')?.replaceChildren(String(n));
    button.addEventListener('click', () => {
      active = key;
      buttons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
      render();
    });
  });

  let timer;
  search?.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      query = search.value.trim();
      render();
    }, 160);
  });

  render();
})();
