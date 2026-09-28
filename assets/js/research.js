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
    safety: 'Safe & verifiable learning',
    adaptation: 'Prediction & costly adaptation',
    information: 'Partial & human information',
    distributed: 'Distributed & multi-agent intelligence',
    robust: 'Dynamic, secure & robust AI'
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
      ].join(' '));
      return terms.every((term) => haystack.includes(term));
    }).sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title));
  }

  function card(project) {
    const directionTags = (project.directions || [])
      .map((key) => `<span class="project-direction project-direction-${escapeHTML(key)}">${escapeHTML(labels[key] || key)}</span>`)
      .join('');
    const methodTags = (project.methods || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join('');
    const systemTags = (project.systems || []).map((item) => `<span class="system-pill">${escapeHTML(item)}</span>`).join('');
    const link = project.link
      ? `<a class="project-link" href="${escapeHTML(project.link)}" ${project.link.startsWith('http') || project.link.endsWith('.pdf') ? 'target="_blank" rel="noopener"' : ''}>Open related work <span aria-hidden="true">→</span></a>`
      : '';
    return `
      <article class="research-project-card reveal is-visible" data-project-id="${escapeHTML(project.id)}">
        <div class="project-card-topline">
          <span class="project-kind">${escapeHTML(project.kind)}</span>
          <span class="project-status">${escapeHTML(project.status)}</span>
        </div>
        <h3>${escapeHTML(project.title)}</h3>
        <div class="project-directions">${directionTags}</div>
        <p>${escapeHTML(project.summary)}</p>
        <div class="project-insight"><strong>Core idea</strong><span>${escapeHTML(project.insight)}</span></div>
        <div class="project-meta-block"><strong>Methods</strong><div class="tag-row">${methodTags}</div></div>
        <div class="project-meta-block"><strong>Systems</strong><div class="system-row">${systemTags}</div></div>
        ${link}
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
