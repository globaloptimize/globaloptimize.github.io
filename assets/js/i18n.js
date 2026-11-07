/* English is the source language. Translations never replace scholarly data. */
(() => {
  'use strict';

  const root = document.documentElement;
  const dictionary = window.SITE_ZH || {};
  const attributeDictionary = window.SITE_ZH_ATTRIBUTES || {};
  const storageKey = 'ming-shi-site-language';
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const localizedAttributes = ['aria-label', 'title', 'placeholder', 'alt'];
  const excludedSelector = 'script, style, code, pre, noscript, textarea, [data-i18n-skip], [data-language-toggle], [data-buffalo-time]';
  const protectedSelector = excludedSelector + ', .publication-meta-v5, .paper-authors, .paper-venue, .publication-row-v5 h3, .author-legend .current-author';
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  let language = 'en';
  let observer;

  function validLanguage(value) {
    if (/^zh(?:-cn)?$/i.test(value || '')) return 'zh-CN';
    return value === 'en' ? 'en' : null;
  }

  function initialLanguage() {
    const explicit = validLanguage(new URLSearchParams(location.search).get('lang'));
    if (explicit) return explicit;
    try { return validLanguage(localStorage.getItem(storageKey)) || 'en'; }
    catch (_) { return 'en'; }
  }

  function translatedValue(source, attribute = false) {
    const key = normalize(source);
    if (attribute && Object.hasOwn(attributeDictionary, key)) return attributeDictionary[key];
    if (Object.hasOwn(dictionary, key)) return dictionary[key];
    let match;
    if ((match = key.match(/^(\d+) works? shown$/))) return `显示 ${match[1]} 项成果`;
    if ((match = key.match(/^(\d+) projects? shown$/))) return `显示 ${match[1]} 个研究项目`;
    if ((match = key.match(/^(\d+) active$/))) return `已启用 ${match[1]} 项`;
    if ((match = key.match(/^Show all (\d+) items$/))) return `显示全部 ${match[1]} 项`;
    if ((match = key.match(/^(.*) \| Ming Shi$/))) return `${translatedValue(match[1])} | 石鸣`;
    const prefixes = [
      ['Read PDF for ', '阅读 PDF：'], ['Source for ', '查看来源：'],
      ['DOI for ', 'DOI：'], ['Copy citation for ', '复制引用：'],
      ['Full citation and research topics for ', '完整引用与研究主题：']
    ];
    for (const [prefix, chinese] of prefixes) {
      if (key.startsWith(prefix)) return chinese + key.slice(prefix.length);
    }
    return source;
  }

  function translate(source, attribute = false) {
    if (language !== 'zh-CN' || !normalize(source)) return source;
    const translated = translatedValue(source, attribute);
    if (translated === source) return source;
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    return leading + translated + trailing;
  }

  function protectedElement(element) {
    return !element || Boolean(element.closest(protectedSelector));
  }

  function translateNode(node) {
    if (protectedElement(node.parentElement) || !normalize(node.nodeValue)) return;
    let record = textSources.get(node);
    if (!record || node.nodeValue !== record.rendered) {
      record = { source: node.nodeValue, rendered: node.nodeValue };
      textSources.set(node, record);
    }
    const value = translate(record.source);
    if (node.nodeValue !== value) node.nodeValue = value;
    record.rendered = value;
  }

  function attributesFor(element) {
    let records = attributeSources.get(element);
    if (!records) { records = new Map(); attributeSources.set(element, records); }
    return records;
  }

  function sourceAttribute(element, name) {
    return attributeSources.get(element)?.get(name)?.source ?? element.getAttribute(name) ?? '';
  }

  function setAttribute(element, name, source) {
    const value = translate(source, true);
    attributesFor(element).set(name, { source, rendered: value });
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  }

  function translateAttribute(element, name) {
    if (!element.hasAttribute(name)) return;
    const current = element.getAttribute(name);
    let record = attributesFor(element).get(name);
    if (!record || current !== record.rendered) {
      record = { source: current, rendered: current };
      attributesFor(element).set(name, record);
    }
    const value = translate(record.source, true);
    if (current !== value) element.setAttribute(name, value);
    record.rendered = value;
  }

  function documentLink(element) {
    const raw = element.getAttribute('href');
    if (!raw || raw.startsWith('#')) return;
    let record = attributesFor(element).get('href');
    if (!record || raw !== record.rendered) {
      record = { source: raw, rendered: raw };
      attributesFor(element).set('href', record);
    }
    try {
      const url = new URL(record.source, location.href);
      if (url.origin !== location.origin || !(url.pathname === '/' || /\.html$/i.test(url.pathname))) return;
      if (language === 'zh-CN') url.searchParams.set('lang', 'zh-CN');
      else url.searchParams.delete('lang');
      const value = language === 'en' && !/[?&]lang=/.test(record.source)
        ? record.source : url.pathname + url.search + url.hash;
      if (raw !== value) element.setAttribute('href', value);
      record.rendered = value;
    } catch (_) { /* Leave non-URL links untouched. */ }
  }

  function translateElement(element) {
    if (element.closest(excludedSelector)) return;
    localizedAttributes.forEach((name) => translateAttribute(element, name));
    if (element.tagName === 'META' && /^(description|og:title|og:description|og:site_name|twitter:title|twitter:description)$/.test(element.name || element.getAttribute('property') || '')) {
      translateAttribute(element, 'content');
    }
    if (element.tagName === 'A') documentLink(element);
  }

  function translateSubtree(scope) {
    if (scope.nodeType === Node.TEXT_NODE) { translateNode(scope); return; }
    if (scope.nodeType !== Node.ELEMENT_NODE && scope.nodeType !== Node.DOCUMENT_NODE) return;
    if (scope.nodeType === Node.ELEMENT_NODE) translateElement(scope);
    scope.querySelectorAll('*').forEach(translateElement);
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateNode(walker.currentNode);
  }

  function observe() {
    observer?.observe(root, { subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: [...localizedAttributes, 'content', 'href'] });
  }

  function setText(element, source) {
    const value = translate(source);
    if (element.childNodes.length === 1 && element.firstChild.nodeType === Node.TEXT_NODE) {
      const node = element.firstChild;
      textSources.set(node, { source, rendered: value });
      if (node.nodeValue !== value) node.nodeValue = value;
    } else {
      element.textContent = value;
      textSources.set(element.firstChild, { source, rendered: value });
    }
  }

  function updateURL() {
    try {
      const url = new URL(location.href);
      if (language === 'zh-CN') url.searchParams.set('lang', 'zh-CN');
      else url.searchParams.delete('lang');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch (_) { /* The English source also works when opened from disk. */ }
  }

  function setLanguage(next, persist = false) {
    language = validLanguage(next) || 'en';
    observer?.disconnect();
    root.lang = language;
    root.dataset.language = language;
    updateURL();
    document.querySelectorAll('[data-lang-only]').forEach((element) => {
      element.hidden = element.dataset.langOnly !== language;
    });
    document.querySelectorAll('.publication-meta-v5, .paper-authors, .paper-venue, .publication-row-v5 h3, .author-legend .current-author').forEach((element) => {
      element.lang = 'en';
    });
    translateSubtree(document);
    document.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.hidden = false;
      button.textContent = language === 'en' ? '简体中文' : 'English';
      button.lang = language === 'en' ? 'zh-CN' : 'en';
      const label = language === 'en' ? 'Switch to Simplified Chinese' : '切换为英文';
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    if (persist) {
      try { localStorage.setItem(storageKey, language); } catch (_) { /* Links retain the choice without storage. */ }
    }
    observe();
    document.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language } }));
  }

  window.SiteI18n = {
    get language() { return language; },
    t: (source) => translate(source), setLanguage, setText, setAttribute, sourceAttribute,
    searchText(value) {
      const source = String(value || '');
      const chinese = translatedValue(source);
      return source + (chinese !== source ? ' ' + chinese : '') + (/\bMing Shi\b/.test(source) ? ' 石鸣' : '');
    }
  };

  observer = new MutationObserver((mutations) => {
    observer.disconnect();
    const scopes = new Set();
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') scopes.add(mutation.target);
      else if (mutation.type === 'characterData') scopes.add(mutation.target);
      else mutation.addedNodes.forEach((node) => scopes.add(node));
    }
    scopes.forEach((scope) => { if (scope.isConnected) translateSubtree(scope); });
    observe();
  });
  document.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(language === 'en' ? 'zh-CN' : 'en', true));
  });
  const explicitLanguage = validLanguage(new URLSearchParams(location.search).get('lang'));
  setLanguage(initialLanguage(), Boolean(explicitLanguage));
})();
