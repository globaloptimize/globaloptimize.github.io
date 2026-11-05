/* Progressive disclosure and motion; all content works without JavaScript. */
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

  // Animate elements as an enhancement, without hiding them in the stylesheet.
  // Cancelling an animation always restores the ordinary readable layout.
  const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  const seen = new WeakSet();

  function animate(element, keyframes, options) {
    if (!motionPreference || motionPreference.matches || typeof element.animate !== 'function') return;
    try {
      const animation = element.animate(keyframes, options);
      activeAnimations.add(animation);
      const clear = () => activeAnimations.delete(animation);
      animation.finished.then(clear, clear);
    } catch (_) {
      // Unsupported animation features must never affect access to the content.
    }
  }

  function cancelMotion() {
    if (!motionPreference?.matches) return;
    activeAnimations.forEach((animation) => animation.cancel());
    activeAnimations.clear();
  }

  if (motionPreference?.addEventListener) motionPreference.addEventListener('change', cancelMotion);
  else motionPreference?.addListener(cancelMotion);

  if ('IntersectionObserver' in window && motionPreference) {
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        animate(entry.target, [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: 440,
          delay: Math.min(stagger++, 2) * 55,
          easing: 'cubic-bezier(.2, .7, .2, 1)',
          fill: 'backwards'
        });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll([
      '.home-copy-v5', '.home-portrait-v5', '.page-intro-v5 .intro-copy-v5',
      '.intro-figure-v5', '.section-heading-v5', '.overview-card-v5',
      '.news-item-v6', '.background-list-v6 > li'
    ].join(', ')).forEach((element) => observer.observe(element));
  }

  // Short disclosures get a brief fade; long records open immediately.
  document.addEventListener('toggle', (event) => {
    const disclosure = event.target;
    if (!(disclosure instanceof HTMLDetailsElement) || !disclosure.open || !disclosure.matches('.disclosure-v5')) return;
    const body = disclosure.querySelector(':scope > .detail-body-v5');
    if (!body || body.getBoundingClientRect().height > 650) return;
    animate(body, [
      { opacity: 0.35, transform: 'translateY(5px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 200, easing: 'ease-out' });
  }, true);
})();
