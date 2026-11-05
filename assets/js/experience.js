/* Progressive disclosure enhancements; native details work without JavaScript. */
(() => {
  'use strict';

  // Deep links remain useful even when their destination is inside a disclosure.
  function revealFragment() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    let ancestor = target;
    while (ancestor) {
      if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
    window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  window.addEventListener('hashchange', revealFragment);
  // Clicking an already-selected fragment should reopen its disclosure too.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash === location.hash) revealFragment();
  });
  revealFragment();
})();
